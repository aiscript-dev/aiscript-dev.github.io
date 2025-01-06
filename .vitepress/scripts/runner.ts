export abstract class Runner {
    abstract version: string;

    protected print: (text: string) => void;
    constructor({ print }: {
        print(text: string): void;
    }) {
        this.print = print;
    }

    abstract parse(code: string): readonly [unknown, Map<string | null, unknown> | undefined];
    abstract exec(node: unknown): Promise<void>;
    abstract isAiScriptError(error: unknown): error is Error;
    abstract getErrorName(error: Error): string | undefined;
    abstract dispose(): void;
}
