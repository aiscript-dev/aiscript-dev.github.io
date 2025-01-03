<template>
    <div :class="$style.playgroundRoot">
        <div :class="$style.playgroundHeader">
            <div :class="$style.playgroundHeaderInner">
                <div>Playground <small>(v{{ AISCRIPT_VERSION }})</small></div>
                <div :class="$style.playgroundOptions"></div>
            </div>
        </div>
        <div :class="[$style.playgroundPaneRoot, $style.playgroundEditorPane]">
            <div :class="$style.playgroundPaneHeader">
                <div :class="$style.playgroundResultActionsLeft">
                    <button :class="$style.playgroundButton" @click="replaceWithFizzbuzz">Fizzbuzz</button>
                </div>
                <div :class="$style.playgroundResultActionsRight">
                    <button :class="$style.playgroundButton" :disabled="!isRunning" @click="abort">Abort</button>
                    <button :class="[$style.playgroundButton, $style.playgroundButtonPrimary]" @click="run">Run</button>
                </div>
            </div>

            <div :class="$style.playgroundEditorRoot">
                <div :class="$style.playgroundEditorScroller">
                    <div :class="[$style.highlight, $style.playgroundEditorHighlight]" v-html="editorHtml"></div>
                    <textarea
                        ref="inputEl"
                        v-model="code"
                        @input="onInput"
                        @keydown="onKeydown"
                        autocomplete="off"
                        wrap="off"
                        spellcheck="false"
                        :class="$style.playgroundEditorTextarea"
                    ></textarea>
                </div>
            </div>
        </div>
        <div :class="$style.playgroundPaneRoot">
            <div :class="$style.playgroundPaneHeader">
                <div :class="$style.playgroundResultTabs">
                    <input type="radio" id="output" v-model="resultTab" value="output">
                    <label for="output">Output</label>
                    <input type="radio" id="ast" v-model="resultTab" value="ast">
                    <label for="ast">AST</label>
                </div>
                <div :class="$style.playgroundResultActionsRight">
                    <button :class="[$style.playgroundButton]" @click="clearLog">Clear</button>
                </div>
            </div>
            <div ref="logEl" v-if="resultTab === 'output'" :class="[$style.playgroundResultContent, $style.playgroundResultLogs]">
                <div
                    v-for="log in logs"
                    :key="log.text"
                    :class="[
                        $style.playgroundResultLogItem,
                        {
                            [$style.error]: log.type === 'error',
                            [$style.info]: log.type === 'info',
                        }
                    ]"
                >{{ log.text }}</div>
            </div>
            <div v-else-if="resultTab === 'ast'" :class="$style.playgroundResultContent">
                <div :class="$style.highlight" v-html="astHtml"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AISCRIPT_VERSION, Parser, Interpreter, utils, errors, type Ast } from '@syuilo/aiscript';
import { inBrowser } from 'vitepress';
import { ref, computed, useTemplateRef, nextTick, onMounted, watch, onUnmounted } from 'vue';
import { createHighlighterCore } from 'shiki/core';
import type { HighlighterCore, LanguageRegistration } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';
import lzString from 'lz-string';
import { useThrottle } from '../scripts/throttle';

// lz-stringがCommonJSモジュールだったみたいなので
const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString;

const fizzbuzz = `for (let i, 100) {
\t<: if (i % 15 == 0) "FizzBuzz"
\t\telif (i % 3 == 0) "Fizz"
\t\telif (i % 5 == 0) "Buzz"
\t\telse i
}`;

const resultTab = ref<'output' | 'ast'>('output');

//#region Editor
const inputEl = useTemplateRef('inputEl');
const code = ref(fizzbuzz);
const editorHtml = ref('');

let highlighter: HighlighterCore | null = null;

async function init() {
    highlighter = await createHighlighterCore({
        langs: [
            import('shiki/langs/json.mjs'),
            import('aiscript-vscode/aiscript/syntaxes/aiscript.tmLanguage.json') as unknown as LanguageRegistration,
        ],
        themes: [
            import('shiki/themes/github-light.mjs'),
            import('shiki/themes/github-dark.mjs'),
        ],
        engine: createOnigurumaEngine(import('shiki/onig.wasm?init')),
    });
}

function onInput(ev: Event) {
    code.value = (ev.target as HTMLTextAreaElement)?.value ?? code.value;
}

function onKeydown(ev: KeyboardEvent) {
    if (ev.isComposing || ev.key === 'Process' || ev.keyCode === 229) return;

    if (ev.code === 'Enter') {
        const pos = inputEl.value?.selectionStart ?? 0;
        const posEnd = inputEl.value?.selectionEnd ?? code.value.length;
        if (pos === posEnd) {
            const lines = code.value.slice(0, pos).split('\n');
            const currentLine = lines[lines.length - 1];
            const currentLineSpaces = currentLine.match(/^\s+/);
            const posDelta = currentLineSpaces ? currentLineSpaces[0].length : 0;
            ev.preventDefault();
            code.value = code.value.slice(0, pos) + '\n' + (currentLineSpaces ? currentLineSpaces[0] : '') + code.value.slice(pos);
            nextTick(() => {
                inputEl.value?.setSelectionRange(pos + 1 + posDelta, pos + 1 + posDelta);
            });
        }
    }

    if (ev.key === 'Tab') {
        const pos = inputEl.value?.selectionStart ?? 0;
        const posEnd = inputEl.value?.selectionEnd ?? code.value.length;
        code.value = code.value.slice(0, pos) + '\t' + code.value.slice(posEnd);
        nextTick(() => {
            inputEl.value?.setSelectionRange(pos + 1, pos + 1);
        });
        ev.preventDefault();
    }
}

function replaceWithFizzbuzz() {
    code.value = fizzbuzz;
}
//#endregion

//#region Runner
let parser: Parser | null = null;
let interpreter: Interpreter | null = null;

const isRunning = ref(false);

const logs = ref<{
    type?: 'info' | 'error';
    text: string;
}[]>([]);
const logEl = useTemplateRef('logEl');

const ast = ref<Ast.Node[] | null>(null);
const astHtml = ref('');

function parse() {
    if (parser != null) {
        try {
            const _ast = parser.parse(code.value);
            logs.value = [];
            ast.value = _ast;
        } catch (err) {
            if (err instanceof errors.AiScriptError) {
                logs.value = [{
                    text: `[SyntaxError] ${err.name}: ${err.message}`,
                    type: 'error',
                }];
            }
            ast.value = null;
        }
    } else {
        ast.value = null;
    }
}

function initAiScriptEnv() {
    if (parser == null) {
        parser = new Parser();
    }
    if (interpreter != null) {
        interpreter.abort();
    }
    interpreter = new Interpreter({}, {
        out: (value) => {
            logs.value.push({
                text: value.type === 'num' ? value.value.toString() : value.type === 'str' ? `"${value.value}"` : JSON.stringify(utils.valToJs(value), null, 2) ?? '',
            });
        },
        log: (type, params) => {
            if (type === 'end' && params.val != null && 'type' in params.val) {
                logs.value.push({
                    text: utils.valToString(params.val, true),
                });
            }
        },
    });
}

async function run() {
    console.log('run');
    initAiScriptEnv();

    resultTab.value = 'output';
    logs.value = [];
    isRunning.value = true;

    parse();
    if (ast.value != null && interpreter !== null) {
        try {
            const execStartTime = performance.now();
            await interpreter.exec(ast.value);
            const execEndTime = performance.now();
            logs.value.push({
                text: `[Playground] Execution Completed in ${Math.round(execEndTime - execStartTime)}ms`,
                type: 'info',
            });
            if (resultTab.value === 'output' && logEl.value != null) {
                logEl.value.scrollTo({
                    top: logEl.value.scrollHeight,
                });
            }
        } catch (err) {
            if (err instanceof errors.AiScriptError) {
                let errorName = 'AiScriptError';

                if (err instanceof errors.AiScriptSyntaxError) {
                    errorName = 'SyntaxError';
                } else if (err instanceof errors.AiScriptTypeError) {
                    errorName = 'TypeError';
                } else if (err instanceof errors.AiScriptRuntimeError) {
                    errorName = 'RuntimeError';
                } else if (err instanceof errors.AiScriptIndexOutOfRangeError) {
                    errorName = 'IndexOutOfRangeError';
                } else if (err instanceof errors.AiScriptUserError) {
                    errorName = 'UserError';
                }

                logs.value.push({
                    text: `[${errorName}] ${err.name}: ${err.message}`,
                    type: 'error',
                });
            } else {
                logs.value.push({
                    text: `[Error] ${err}`,
                    type: 'error',
                });
            }
        } finally {
            isRunning.value = false;
        }
    }
}

function abort() {
    if (interpreter != null) {
        interpreter.abort();
        logs.value.push({
            text: '[Playground] Execution Aborted',
            type: 'info',
        });
    }
}

function clearLog() {
    resultTab.value = 'output';
    logs.value = [];
}
//#endregion

//#region Permalink with hash
type HashData = {
    code: string;
    // TODO: バージョン情報（マルチバージョン対応の際に必要。なければ最新にフォールバック）
};
const hash = ref<string | null>(inBrowser ? window.location.hash.slice(1) || localStorage.getItem('ais:playground') : null);
const hashData = computed<HashData | null>(() => {
    if (hash.value == null) return null;
    try {
        return JSON.parse(decompressFromEncodedURIComponent(hash.value));
    } catch {
        return null;
    }
});
const updateHash = useThrottle((d: HashData) => {
    hash.value = compressToEncodedURIComponent(JSON.stringify(d));
    localStorage.setItem('ais:playground', hash.value);
    const currentHistoryPayload = window.history.state;
    window.history.replaceState(currentHistoryPayload, '', '#' + hash.value);
}, 250);
//#endregion

onMounted(async () => {
    await init();
    initAiScriptEnv();

    if (hashData.value != null && hashData.value.code != null) {
        code.value = hashData.value.code;
    }
    watch([code], () => {
        updateHash({ code: code.value });
    }, { immediate: true });

    watch(code, async (newCode) => {
        parse();
        if (highlighter) {
            editorHtml.value = highlighter.codeToHtml(newCode, {
                lang: 'aiscript',
                themes: {
                    light: 'github-light',
                    dark: 'github-dark',
                },
                defaultColor: false,
            });
        }
    }, { immediate: true });

    watch(ast, async (newAst) => {
        if (highlighter && newAst != null) {
            astHtml.value = highlighter.codeToHtml(JSON.stringify(newAst, null, 2), {
                lang: 'json',
                themes: {
                    light: 'github-light',
                    dark: 'github-dark',
                },
                defaultColor: false,
            });
        }
    });
});

onUnmounted(() => {
    if (interpreter != null) {
        interpreter.abort();
    }
});
</script>

<style module>
.playgroundRoot {
    display: grid;
    height: calc(100vh - var(--vp-nav-height));
    grid-template-rows: auto 1fr;
    grid-template-columns: 1fr 1fr;
}

.playgroundHeader {
    grid-column: 1 / -1;
    border-bottom: 1px solid var(--vp-c-divider);
}

.playgroundHeaderInner {
    margin: 0 auto;
    padding: 0.5em 36px;
    display: flex;
}

.playgroundOptions {
    margin-left: auto;
}

.playgroundPaneRoot {
    display: grid;
    grid-template-rows: 40px 1fr;
    min-height: 0;
}

.playgroundPaneHeader {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--vp-c-divider);
}

.playgroundEditorPane {
    border-right: 1px solid var(--vp-c-divider);
}

.playgroundEditorRoot {
    position: relative;
    overflow: scroll;
}

.playgroundEditorScroller {
	position: relative;
    padding: 24px 36px;
    min-width: 100%;
    min-height: 100%;
    width: max-content;
    height: max-content;

    tab-size: 2;
}

.playgroundEditorTextarea {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    appearance: none;
    resize: none;
    overflow: hidden;
    text-align: left;
    color: transparent;
    caret-color: var(--vp-c-text-1);
    background-color: transparent;
    border: 0;
    box-sizing: border-box;
    outline: 0;
    min-width: 100%;
    min-height: 100%;
    padding: 24px 36px;
    line-height: 20px;
    font-size: 14px;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
}

.playgroundEditorHighlight {
    display: block;
    pointer-events: none;
    line-height: 20px;
    font-size: 14px;
    font-family: Consolas, Monaco, Andale Mono, Ubuntu Mono, monospace;
}

.highlight pre {
    margin: 0;
}

.highlight span:global(.line) {
    display: inline-block;
    min-height: 1em;
}

:global(html.dark) .highlight span {
  color: var(--shiki-dark, inherit);
}

:global(html:not(.dark)) .highlight span {
  color: var(--shiki-light, inherit);
}

.playgroundResultTabs {
    display: flex;
}

.playgroundResultTabs input[type="radio"] {
    display: none;
}

.playgroundResultTabs label {
    display: block;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    padding: 0 16px;
    line-height: 40px;
    border-bottom: 2px solid transparent;
}

.playgroundResultTabs input[type="radio"]:checked + label {
    font-weight: 700;
    border-bottom-color: var(--vp-c-brand-1);
}

.playgroundResultActionsLeft {
    display: flex;
    gap: 8px;
    align-items: center;

    padding-left: 36px;
}

.playgroundResultActionsRight {
    display: flex;
    gap: 8px;
    align-items: center;

    margin-left: auto;
    padding-right: 36px;
}

.playgroundResultContent {
    padding: 24px;
    overflow-y: scroll;
}

.playgroundResultContent pre {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
}

.playgroundResultLogs {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.playgroundResultLogItem {
    font-family: var(--vp-font-family-mono);
    white-space: pre-wrap;
    font-size: 14px;
    padding: 0 8px;
    border-radius: 4px;
}

.playgroundResultLogItem.error {
    background-color: var(--vp-c-danger-soft);
    color: var(--vp-c-danger-1);
}

.playgroundResultLogItem.info {
    background-color: var(--vp-c-tip-soft);
    color: var(--vp-c-tip-2);
    font-style: italic;
}

.playgroundButton {
    background-color: var(--vp-button-alt-bg);
    transition: background-color 0.25s;
    padding: 3px 16px;
    border-radius: 8px;
}

.playgroundButton:disabled {
    opacity: 0.5;
}

.playgroundButton:hover {
    background-color: var(--vp-button-alt-hover-bg);
}

.playgroundButton:not(.playgroundButtonPrimary) {
    font-size: 80%;
}

.playgroundButtonPrimary {
    background-color: var(--vp-button-brand-bg);
    color: var(--vp-button-brand-text);
    font-weight: 700;
}

.playgroundButtonPrimary:hover {
    color: var(--vp-button-brand-hover-text);
    background-color: var(--vp-button-brand-hover-bg);
}

@media (max-width: 768px) {
    .playgroundEditorScroller,
    .playgroundEditorTextarea {
        padding: 24px 24px;
    }

    .playgroundHeaderInner {
        padding: 0.5em 24px;
    }

    .playgroundResultActionsLeft {
        padding-left: 24px;
    }

    .playgroundResultActionsRight {
        padding-right: 24px;
    }

    .playgroundRoot {
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr 1fr;
    }

    .playgroundEditorPane {
        border-right: 0;
        border-bottom: 1px solid var(--vp-c-divider);
    }
}
</style>
