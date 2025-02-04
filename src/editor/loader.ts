import { loader } from "@monaco-editor/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { registerRulesForLanguage } from "monaco-ace-tokenizer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AceHighlightHaskell from "monaco-ace-tokenizer/es/ace/definitions/haskell";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import { CE_MonacoTheme } from "@/theme/monaco";

import { monacoDraculaTheme } from "./themes/dracula";
import { monacoOneLightTheme } from "./themes/one-light";

self.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === "json") {
            return new jsonWorker();
        }
        if (label === "css" || label === "scss" || label === "less") {
            return new cssWorker();
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return new htmlWorker();
        }
        if (label === "typescript" || label === "javascript") {
            return new tsWorker();
        }
        return new editorWorker();
    },
};

// ACE highlights
monaco.languages.register({ id: "haskell" });
registerRulesForLanguage("haskell", new AceHighlightHaskell());

// monaco themes
monaco.editor.defineTheme(CE_MonacoTheme.OneLight, monacoOneLightTheme);
monaco.editor.defineTheme(CE_MonacoTheme.Dracula, monacoDraculaTheme);

loader.config({ monaco });
