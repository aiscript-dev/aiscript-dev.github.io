<template>
    <div :class="$style.playgroundRoot">
        <div :class="$style.playgroundHeader">
            <div :class="$style.playgroundHeaderInner">
                <div>Playground <small>(v{{ runner?.version ?? "???" }})</small></div>
                <div :class="$style.playgroundOptions">
                    <select :class="$style.playgroundSelect" v-model="version">
                        <option v-for="version in versionModules.keys()" :value="version">
                            {{ version === latestVersion ? `${version} (latest)` : version }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
        <div :class="[$style.playgroundPaneRoot, $style.playgroundEditorPane]">
            <div :class="$style.playgroundPaneHeader">
                <div :class="$style.playgroundResultActionsLeft">
                    <button :class="$style.playgroundButton" :disabled="editorLoading" @click="replaceWithFizzbuzz">Fizzbuzz</button>
                </div>
                <div :class="$style.playgroundResultActionsRight">
                    <button :class="$style.playgroundButton" :disabled="!isRunning" @click="abort">Abort</button>
                    <button :class="[$style.playgroundButton, $style.playgroundButtonPrimary]" :disabled="editorLoading" @click="run">Run</button>
                </div>
            </div>

            <div :class="$style.playgroundEditorRoot">
                <div :class="$style.playgroundEditorScRoot">
                    <div :class="$style.playgroundEditorScroller" :inert="editorLoading">
                        <div :class="[$style.highlight, $style.playgroundEditorHighlight]" v-html="editorHtml"></div>
                        <textarea
                            ref="inputEl"
                            v-model="code"
                            @input="onInput"
                            @keydown="onKeydown"
                            @selectionchange.passive="setEditorCursorPosition"
                            autocomplete="off"
                            wrap="off"
                            spellcheck="false"
                            :class="$style.playgroundEditorTextarea"
                        ></textarea>
                    </div>
                </div>
                <div :class="$style.playgroundInfoFooter">
                    <div>Row: {{ currentCursor.row + 1 }}, Column: {{ currentCursor.column + 1 }}</div>
                </div>
                <div v-if="editorLoading" :class="$style.playgroundEditorLoading">
                    <div>Loading...</div>
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
                    <input type="radio" id="metadata" v-model="resultTab" value="metadata">
                    <label for="metadata">Metadata</label>
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
                <div v-if="isSyntaxError" class="danger custom-block">
                    <p class="custom-block-title">Syntax Error</p>
                    <p>See Output tab for details</p>
                </div>
                <div v-else :class="$style.highlight" v-html="astHtml"></div>
            </div>
            <div v-else-if="resultTab === 'metadata'" :class="$style.playgroundResultContent">
                <div v-if="isSyntaxError" class="danger custom-block">
                    <p class="custom-block-title">Syntax Error</p>
                    <p>See Output tab for details</p>
                </div>
                <div v-else-if="metadata" :class="$style.highlight" v-html="metadataHtml"></div>
                <div v-else>No metadata</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inBrowser } from 'vitepress';
import { ref, computed, useTemplateRef, nextTick, onMounted, watch, onUnmounted } from 'vue';
import { createHighlighterCore } from 'shiki/core';
import type { HighlighterCore, LanguageRegistration, ShikiTransformerContext } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import lzString from 'lz-string';
import { useThrottle } from '../scripts/throttle';
import type { Runner } from '../scripts/runner';
import { latestVersion, versionModules } from '../scripts/versions';

// lz-stringがCommonJSモジュールだったみたいなので
const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString;

const fizzbuzz = `for (let i, 100) {
\t<: if (i % 15 == 0) "FizzBuzz"
\t\telif (i % 3 == 0) "Fizz"
\t\telif (i % 5 == 0) "Buzz"
\t\telse i
}`;

const resultTab = ref<'output' | 'ast' | 'metadata'>('output');

//#region Editor
const editorLoading = ref(true);
const inputEl = useTemplateRef('inputEl');
const code = ref(fizzbuzz);
const editorHtml = ref('');
const currentCursor = ref<{
    row: number;
    column: number;
}>({
    row: 0,
    column: 0,
});

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
        engine: createJavaScriptRegexEngine({
            forgiving: true,
        }),
    });
}

function setEditorCursorPosition() {
    if (inputEl.value == null) return;

    const pos = inputEl.value.selectionDirection === 'backward'
        ? inputEl.value.selectionStart
        : inputEl.value.selectionEnd;
    const lines = code.value.slice(0, pos).split('\n');

    currentCursor.value = {
        row: lines.length - 1,
        column: lines[lines.length - 1].length,
    };
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
let RunnerConstructor: new (...args: ConstructorParameters<typeof Runner>) => Runner;
const runner = ref<Runner>();

const version = ref(latestVersion);

const isRunning = ref(false);

const logs = ref<{
    type?: 'info' | 'error';
    text: string;
}[]>([]);
const logEl = useTemplateRef('logEl');

const isSyntaxError = ref(false);
const errorLine = ref<number | null>(null);

const ast = ref<unknown>(null);
const astHtml = ref('');

const metadata = ref<unknown>(null);
const metadataHtml = ref('');

function parse() {
    isSyntaxError.value = false;
    errorLine.value = null;

    if (runner.value == null) {
        ast.value = null;
    } else {
        try {
            const [ast_, metadata_] = runner.value.parse(code.value);
            logs.value = [];
            ast.value = ast_;
            metadata.value = metadata_?.get(null) ?? null;
        } catch (err) {
            if (runner.value.isAiScriptError(err)) {
                logs.value = [{
                    text: `[SyntaxError] ${err.name}: ${err.message}`,
                    type: 'error',
                }];
                isSyntaxError.value = true;

                const lineRes = /\(Line\s*(:\s*)?(\d+)/.exec(err.message);
                if (lineRes != null) {
                    errorLine.value = parseInt(lineRes[2], 10); // Convert to zero-based index
                } else {
                    errorLine.value = null;
                }
            }
            ast.value = null;
            metadata.value = null;
        }
    }
}

function initAiScriptEnv() {
    runner.value?.dispose();

    runner.value = new RunnerConstructor({
        print(text) {
            logs.value.push({ text });
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
    if (ast.value != null && runner.value != null) {
        try {
            const execStartTime = performance.now();
            await runner.value.exec(ast.value);
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
            if (runner.value.isAiScriptError(err)) {
                const errorName = runner.value.getErrorName(err);
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
    if (runner.value != null) {
        runner.value.dispose();
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
    version?: string;
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
    const loadStartedAt = Date.now();

    await init();

    if (hashData.value != null) {
        if (hashData.value.code != null) {
            code.value = hashData.value.code;
        }
        if (hashData.value.version != null) {
            version.value = hashData.value.version;
        }
    }

    watch(version, async () => {
        editorLoading.value = true;

        const import_ = versionModules.get(version.value);
        if (import_ == null) return;

        const module = await import_();
        RunnerConstructor = module.default;

        initAiScriptEnv();

        editorLoading.value = false;
    }, { immediate: true });

    watch([code, version], () => {
        updateHash({
            code: code.value,
            version: version.value,
        });
    }, { immediate: true });

    watch([code, runner], ([newCode]) => {
        parse();
        if (highlighter) {
            editorHtml.value = highlighter.codeToHtml(newCode, {
                lang: 'aiscript',
                themes: {
                    light: 'github-light',
                    dark: 'github-dark',
                },
                defaultColor: false,
                transformers: [{
                    line(node, lineIndex) {
                        if (isSyntaxError.value && errorLine.value === lineIndex) {
                            this.addClassToHast(node, 'error');
                        }
                    },
                }],
            });
        }
    }, { immediate: true });

    watch(ast, async (newAst) => {
        if (highlighter) {
            if (newAst == null) {
                astHtml.value = '';
                return;
            }

            astHtml.value = highlighter.codeToHtml(JSON.stringify(newAst, null, 2), {
                lang: 'json',
                themes: {
                    light: 'github-light',
                    dark: 'github-dark',
                },
                defaultColor: false,
            });
        }
    }, { immediate: true });

    watch(metadata, async (newMetadata) => {
        if (highlighter) {
            if (newMetadata == null) {
                metadataHtml.value = '';
                return;
            }

            metadataHtml.value = highlighter.codeToHtml(JSON.stringify(newMetadata, null, 2), {
                lang: 'json',
                themes: {
                    light: 'github-light',
                    dark: 'github-dark',
                },
                defaultColor: false,
            });
        }
    }, { immediate: true });

    const loadEndedAt = Date.now();

    setTimeout(() => {
        editorLoading.value = false;
    }, Math.max(0, 500 - (loadEndedAt - loadStartedAt)));
});

onUnmounted(() => {
    runner.value?.dispose();
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
    padding: 0 36px;
    min-height: 40px;
    display: flex;
    align-items: center;
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
    min-height: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
}

.playgroundEditorScRoot {
    overflow: scroll;
    flex-grow: 1;
}

.playgroundInfoFooter {
    border-top: 1px solid var(--vp-c-divider);
    flex-shrink: 0;
    padding: 0 24px;
    font-size: 12px;
    line-height: 24px;
    color: var(--vp-c-text-2);
}

.playgroundEditorLoading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
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
    min-width: 100%;
}

.highlight span:global(.line.error) {
    background-color: var(--vp-c-danger-soft);
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

.playgroundSelect {
    background-color: var(--vp-button-alt-bg);
    transition: background-color 0.25s;
    padding: 3px 36px 3px 16px;
    border-radius: 8px;
    font-family: var(--vp-font-family-base);
    font-size: 80%;

    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right .75em center;
    background-size: 16px 12px;
}

:global(html.dark) .playgroundSelect {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23fffff5db' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e");
}

.playgroundSelect:hover {
    background-color: var(--vp-button-alt-hover-bg);
}

@media (max-width: 768px) {
    .playgroundEditorScroller,
    .playgroundEditorTextarea {
        padding: 24px 24px;
    }

    .playgroundHeaderInner {
        padding: 0 24px;
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
