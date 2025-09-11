import { minify } from "terser";
import type { Plugin, TerserOptions } from "vite";

const nameCache: Record<string, string> = {};

export function terserPlugin(options: TerserOptions): Plugin {
    return {
        name: "vite-tywzoj-sync-terser-plugin",

        async renderChunk(code, chunk, outputOptions) {
            try {
                const res = await minify(code, {
                    safari10: true,
                    sourceMap: !!outputOptions.sourcemap,
                    module: outputOptions.format.startsWith("es"),
                    toplevel: outputOptions.format === "cjs",
                    nameCache,
                    ...options,
                });
                return {
                    code: res.code!,
                    map: res.map as never,
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                if (e.line !== undefined && e.col !== undefined) {
                    e.loc = {
                        file: chunk.fileName,
                        line: e.line,
                        column: e.col,
                    };
                }
                throw e;
            }
        },
    };
}
