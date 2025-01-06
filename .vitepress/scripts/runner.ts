export type ParseResult =
    | {
        ok: true;
        ast: unknown;
        metadata: Map<string | null, unknown>;
    }
    | {
        ok: false;
        error: Error | null;
    };

export abstract class Runner {
    abstract version: string;

    protected print: (text: string) => void;
    constructor({ print }: {
        print(text: string): void;
    }) {
        this.print = print;
    }

    abstract parse(code: string): ParseResult;
    abstract exec(node: unknown): Promise<void>;
    abstract getErrorName(error: unknown): string | undefined;
    abstract dispose(): void;
}
