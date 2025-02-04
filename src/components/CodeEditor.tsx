import ReactMonacoEditor, { loader } from "@monaco-editor/react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { registerRulesForLanguage } from "monaco-ace-tokenizer";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AceHighlightHaskell from "monaco-ace-tokenizer/es/ace/definitions/haskell";
import * as Monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import React from "react";

import * as themeDracula from "@/assets/themes/monaco-dracula.json";
import * as themeOneLight from "@/assets/themes/monaco-one-light.json";
import { CODE_FONT_FAMILY } from "@/common/constants/font";
import type { CE_CodeLanguage } from "@/compilation/types";
import { useTheme } from "@/theme/hooks";
import { CE_MonacoTheme, getMonacoTheme } from "@/theme/monaco";

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
Monaco.languages.register({ id: "haskell" });
registerRulesForLanguage("haskell", new AceHighlightHaskell());

// Monaco themes
Monaco.editor.defineTheme(CE_MonacoTheme.OneLight, themeOneLight as Monaco.editor.IStandaloneThemeData);
Monaco.editor.defineTheme(CE_MonacoTheme.Dracula, themeDracula as Monaco.editor.IStandaloneThemeData);

loader.config({ monaco: Monaco });

export interface ICodeEditorProps {
    className?: string;
    value: string;
    language: CE_CodeLanguage;
    onChange?: (newValue: string) => void;
    editorDidMount?: (editor: Monaco.editor.IStandaloneCodeEditor) => void;
    options?: Monaco.editor.IEditorConstructionOptions;
}

export const CodeEditor: React.FC<ICodeEditorProps> = (props) => {
    const { className, value, language, onChange, editorDidMount, options } = props;

    const theme = useTheme();

    const refEditor = React.useRef<Monaco.editor.IStandaloneCodeEditor>();
    const onMount = (editor: Monaco.editor.IStandaloneCodeEditor) => {
        editor.getModel()?.setEOL(Monaco.editor.EndOfLineSequence.LF);

        refEditor.current = editor;
        console.log("Monaco Editor:", editor);

        editorDidMount?.(editor);
    };

    // The Monaco Editor's automaticLayout option doesn't work on a initially hidden editor
    // So use ResizeSensor instead
    const containerRef = React.useRef<HTMLDivElement>();
    const resizeSensorRef = React.useRef<ResizeSensor>();
    const initializeResizeSensor = (div: HTMLDivElement) => {
        if (containerRef.current !== div) {
            resizeSensorRef.current?.detach();
            if (div) {
                resizeSensorRef.current = new ResizeSensor(div, () => {
                    refEditor.current?.layout();
                });
            } else {
                resizeSensorRef.current = undefined;
            }
            containerRef.current = div;
        }
    };

    return (
        <div ref={initializeResizeSensor} className={className}>
            <ReactMonacoEditor
                theme={getMonacoTheme(theme)}
                language={language}
                value={value}
                options={{
                    lineNumbersMinChars: 4,
                    fontFamily: CODE_FONT_FAMILY,
                    ...options,
                }}
                onMount={onMount}
                onChange={onChange && ((newValue) => onChange(newValue ?? ""))}
            />
        </div>
    );
};

export default CodeEditor;
