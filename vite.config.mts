import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import circleDependency from "vite-plugin-circular-dependency";
import { createHtmlPlugin } from "vite-plugin-html";
import { prismjsPlugin } from "vite-plugin-prismjs";
import { viteVConsole } from "vite-plugin-vconsole";
import tsconfigPaths from "vite-tsconfig-paths";

const ENV_PREFIX = "TYWZOJ_";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
    return {
        envPrefix: ENV_PREFIX,
        plugins: [
            legacy(),
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
            tsconfigPaths({
                projects: [path.resolve("tsconfig.app.json")],
            }),
            TanStackRouterVite({
                routesDirectory: path.resolve("src/pages"),
                generatedRouteTree: path.resolve("src/router/routeTree.gen.ts"),
                quoteStyle: "double",
                autoCodeSplitting: true,
            }),
            react(),
            viteVConsole({
                enabled: command === "serve",
                entry: path.resolve("src/main.tsx"),
                config: {
                    maxLogNumber: 1000,
                },
            }),
            circleDependency({
                exclude: [/node_modules/, /\.yarn/, /\.pnp/],
            }),
            prismjsPlugin({
                languages: fs.readFileSync(path.resolve(".prism-languages"), "utf-8").trim().split("\n"),
                css: false,
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
        worker: {
            rollupOptions: {
                output: {
                    entryFileNames: "workers/[name].[hash].js",
                    chunkFileNames: "workers/[name].[hash].js",
                    assetFileNames: "workers/[name].[hash].[ext]",
                },
            },
        },
    };
});
