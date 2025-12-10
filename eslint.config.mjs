import js from "@eslint/js";
import router from "@tanstack/eslint-plugin-router";
import { defineConfig } from "eslint/config";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const IGNORED_FILES = [
    "node_modules/**",
    "dist/**",
    ".yarn/*",
    ".pnp.*",
    ".github/*",
    "vite.config.*.timestamp*",
    "src/router/routeTree.gen.ts",
    "src/assets/locales/*",
];

const JS_FILE_EXTS = ["js", "cjs", "mjs"];
const TS_FILE_EXTS = ["ts", "cts", "mts"];
const JSX_FILE_EXTS = ["jsx", "tsx"];

const SRC_FILES = createExtFiles("src/**/*", [...JS_FILE_EXTS, ...TS_FILE_EXTS, ...JSX_FILE_EXTS]);

const NODE_JS_FILES = [
    ...createExtFiles("scripts/**/*", JS_FILE_EXTS),
    ...createExtFiles("eslint.config", JS_FILE_EXTS),
];
const NODE_TS_FILES = [...createExtFiles("scripts/**/*", TS_FILE_EXTS), ...createExtFiles("vite.config", TS_FILE_EXTS)];
const NODE_FILES = [...NODE_JS_FILES, ...NODE_TS_FILES];

// Fuck VS Code ESLint extension
const isVsCodeEslint = process.env.NODE_ENV === "vscode-eslint";

export default defineConfig(
    js.configs.recommended,
    tseslint.configs.recommended,
    {
        files: [...SRC_FILES, ...NODE_FILES],
        plugins: {
            "simple-import-sort": simpleImportSort,
        },
        rules: {
            "arrow-parens": ["error", "always"],
            curly: ["error", "multi-line"],
            "import/no-cycle": "off",
            "no-empty": "off",
            "no-extend-native": "error",
            "no-unused-vars": "off",

            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": "error",

            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "explicit",
                    overrides: {
                        constructors: "no-public",
                    },
                },
            ],
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "interface",
                    format: ["PascalCase"],
                    prefix: ["I"],
                },
                {
                    selector: "enum",
                    format: ["PascalCase"],
                    prefix: ["CE_", "E_"],
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase", "UPPER_CASE", "snake_case"],
                },
                {
                    selector: ["function", "classMethod"],
                    modifiers: ["async"],
                    format: ["camelCase", "PascalCase"],
                    suffix: ["Async", "AsyncAction"],
                },
            ],
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    vars: "local",
                    args: "after-used",
                    caughtErrors: "all",
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/prefer-as-const": "error",
        },
    },
    {
        files: SRC_FILES,
        extends: [
            react.configs.flat.recommended,
            react.configs.flat["jsx-runtime"],
            ...router.configs["flat/recommended"],
        ],
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.serviceworker,
            },
            ecmaVersion: 2020,
            parserOptions: {
                projectService: {
                    defaultProject: "tsconfig.app.json",
                    tsconfigRootDir: import.meta.dirname,
                },
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react/prop-types": "off",
            "react-hooks/exhaustive-deps": "error",
            "react-refresh/only-export-components": [
                "error",
                {
                    allowConstantExport: true,
                },
            ],
        },
    },
    {
        files: NODE_TS_FILES,
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                projectService: {
                    defaultProject: "tsconfig.node.json",
                    tsconfigRootDir: import.meta.dirname,
                },
            },
        },
    },
    {
        files: NODE_JS_FILES,
        languageOptions: {
            globals: globals.node,
            parserOptions: {
                ecmaVersion: 2020,
            },
        },
    },
    {
        ...(!isVsCodeEslint && {
            files: [...SRC_FILES, ...NODE_FILES],
            extends: [prettierRecommended],
            rules: {
                "prettier/prettier": [
                    "error",
                    {},
                    {
                        usePrettierrc: true,
                    },
                ],
            },
        }),
    },
    { ignores: IGNORED_FILES },
);

/**
 * @param {string} pattern
 * @param  {string[]} exts
 * @returns {string[]}
 */
function createExtFiles(pattern, exts) {
    return exts.map((ext) => `${pattern}.${ext}`);
}
