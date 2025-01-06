import js from "@eslint/js";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const IGNORED_FILES = ["node_modules/**", "dist/**", ".yarn/*", ".pnp.*", ".github/*"];

const JS_FILE_EXTS = ["js", "cjs", "mjs", "jsx"];
const TS_FILE_EXTS = ["ts", "cts", "mts", "tsx"];

const JS_FILES = createExtFiles("**/*", JS_FILE_EXTS);
const TS_FILES = createExtFiles("**/*", TS_FILE_EXTS);

export default tseslint.config(
    { ignores: IGNORED_FILES },
    js.configs.recommended,
    tseslint.configs.recommended,
    prettierRecommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    {
        files: [...JS_FILES, ...TS_FILES],
        plugins: {
            "simple-import-sort": simpleImportSort,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,

            "arrow-parens": ["error", "always"],
            curly: ["error", "multi-line"],
            "import/no-cycle": "off",
            "no-empty": "off",
            "no-extend-native": "error",
            "no-unused-vars": "off",

            "simple-import-sort/exports": "error",
            "simple-import-sort/imports": "error",

            "prettier/prettier": [
                "error",
                {},
                {
                    usePrettierrc: true,
                },
            ],

            "react-refresh/only-export-components": ["error", { allowConstantExport: true }],
        },
    },
    {
        files: TS_FILES,
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 2020,
            parserOptions: {
                project: "tsconfig.json",
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
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
            "@typescript-eslint/naming-convention": ["error"],
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
    createNameConventionFileRules(
        TS_FILES,
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
            suffix: ["Async"],
        },
    ),
);

/**
 * @param {string} pattern
 * @param  {string[]} exts
 * @returns {string[]}
 */
function createExtFiles(pattern, exts) {
    return exts.map((ext) => `${pattern}.${ext}`);
}

/**
 * @param {string[]} files
 * @param  {...any} rules
 * @returns {{files: string[], rules: { "@typescript-eslint/naming-convention": ["error", ...any[]] }}}
 */
function createNameConventionFileRules(files, ...rules) {
    return {
        files,
        rules: { "@typescript-eslint/naming-convention": ["error", ...rules] },
    };
}
