import { Parser, Interpreter, utils, errors, type Ast, values } from 'aiscript0_14';
import { type ParseResult, Runner } from '../runner';

export default class extends Runner {
    version = '0.14.1';

    parse(code: string): ParseResult {
        try {
            const ast = Parser.parse(code);
            const metadata = Interpreter.collectMetadata(ast) ?? new Map();

            return { ok: true, ast, metadata };
        } catch (error) {
            if (error instanceof errors.AiScriptError) {
                return { ok: false, error };
            }
            return { ok: false, error: null };
        }
    }

    private interpreter = new Interpreter({}, {
        out: (value: values.Value) => {
            this.print(
                value.type === 'num' ? value.value.toString()
                : value.type === 'str' ? `"${value.value}"`
                : JSON.stringify(utils.valToJs(value), null, 2) ?? '',
            );
        },
        log: (type: string, params: { val?: values.Value }) => {
            if (type === 'end' && params.val != null && 'type' in params.val) {
                this.print(utils.valToString(params.val, true));
            }
        },
    });
    async exec(node: unknown): Promise<void> {
        await this.interpreter.exec(node as Ast.Node[]);
    }
    getErrorName(error: unknown): string | undefined {
        if (!(error instanceof errors.AiScriptError)) {
            return;
        }
        if (error instanceof errors.SyntaxError) {
            return 'SyntaxError';
        }
        if (error instanceof errors.TypeError) {
            return 'TypeError';
        }
        if (error instanceof errors.RuntimeError) {
            return 'RuntimeError';
        }
        if (error instanceof errors.IndexOutOfRangeError) {
            return 'IndexOutOfRangeError';
        }
        return 'AiScriptError';
    }
    dispose() {
        this.interpreter.abort();
    }
}
