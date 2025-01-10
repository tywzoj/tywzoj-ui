import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import { viteVConsole } from "vite-plugin-vconsole";
import tsconfigPaths from "vite-tsconfig-paths";

const ENV_PREFIX = "TYWZOJ_";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    return {
        envPrefix: ENV_PREFIX,
        plugins: [
            react(),
            tsconfigPaths(),
            createHtmlPlugin({
                minify: {
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                    minifyCSS: true,
                },
            }),
            viteVConsole({
                enabled: mode !== "production",
                entry: path.resolve("src/main.tsx"),
                config: {
                    maxLogNumber: 1000,
                },
            }),
            TanStackRouterVite({
                routesDirectory: path.resolve("src/pages"),
                quoteStyle: "double",
            }),
        ],
        server: {
            host: "0.0.0.0",
            port: 5055,
            strictPort: true,
        },
        preview: {
            port: 5056,
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: "assets/[name].[hash].js",
                    chunkFileNames: "assets/[name].[hash].js",
                    assetFileNames: "assets/[name].[hash].[ext]",
                },
            },
        },
    };
});
