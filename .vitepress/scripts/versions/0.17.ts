import { AISCRIPT_VERSION, Parser, Interpreter, utils, errors, type Ast } from 'aiscript0_17';
import { Runner } from '../runner';

export default class extends Runner {
    version = AISCRIPT_VERSION;

    parse(code: string) {
        const ast = Parser.parse(code);
        const metadata = Interpreter.collectMetadata(ast);
        return [ast, metadata] as const;
    }

    private interpreter = new Interpreter({}, {
        out: (value) => {
            this.print(
                value.type === 'num' ? value.value.toString()
                : value.type === 'str' ? `"${value.value}"`
                : JSON.stringify(utils.valToJs(value), null, 2) ?? '',
            );
        },
        log: (type, params) => {
            if (type === 'end' && params.val != null && 'type' in params.val) {
                this.print(utils.valToString(params.val, true));
            }
        },
    });
    async exec(node: unknown): Promise<void> {
        await this.interpreter.exec(node as Ast.Node[]);
    }
    isAiScriptError(error: unknown): error is errors.AiScriptError {
        return error instanceof errors.AiScriptError;
    }
    getErrorName(error: errors.AiScriptError): string | undefined {
        if (error instanceof errors.AiScriptSyntaxError) {
            return 'SyntaxError';
        }
        if (error instanceof errors.AiScriptTypeError) {
            return 'TypeError';
        }
        if (error instanceof errors.AiScriptRuntimeError) {
            return 'RuntimeError';
        }
        if (error instanceof errors.AiScriptIndexOutOfRangeError) {
            return 'IndexOutOfRangeError';
        }
        return 'AiScriptError';
    }
    dispose() {
        this.interpreter.abort();
    }
}
