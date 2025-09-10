import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import circleDependency from "vite-plugin-circular-dependency";
import { createHtmlPlugin } from "vite-plugin-html";
import { prismjsPlugin } from "vite-plugin-prismjs";
import { viteVConsole } from "vite-plugin-vconsole";
import tsconfigPaths from "vite-tsconfig-paths";

const ENV_PREFIX = "TYWZOJ_";

interface IEnv {
    readonly TYWZOJ_API_END_POINT_PROXY: string;
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), ENV_PREFIX) as unknown as IEnv;

    return {
        envPrefix: ENV_PREFIX,
        plugins: [
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
            proxy: {
                "/api": {
                    target: env.TYWZOJ_API_END_POINT_PROXY,
                    changeOrigin: true,
                },
            },
        },
        preview: {
            port: 5056,
        },
        build: {
            minify: "esbuild",
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
