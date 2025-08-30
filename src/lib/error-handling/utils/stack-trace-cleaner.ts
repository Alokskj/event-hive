export class StackTraceCleaner {
    private static readonly INTERNAL_PATTERNS = [
        /node_modules/,
        /internal\/modules/,
        /internal\/process/,
        /async_hooks/,
    ];

    static clean(stack?: string): string | undefined {
        if (!stack) return undefined;

        const lines = stack.split('\n');
        const cleanedLines = lines.filter((line, index) => {
            // Always keep the first line (error message)
            if (index === 0) return true;

            // Filter out internal Node.js and library traces
            return !this.INTERNAL_PATTERNS.some((pattern) =>
                pattern.test(line),
            );
        });

        return cleanedLines.join('\n');
    }

    static limit(stack?: string, maxLines: number = 10): string | undefined {
        if (!stack) return undefined;

        const lines = stack.split('\n');
        return lines.slice(0, maxLines + 1).join('\n'); // +1 for error message line
    }
}
