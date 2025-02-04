import "./loader";

import ReactMonacoEditor from "@monaco-editor/react";
import ResizeSensor from "css-element-queries/src/ResizeSensor";
import * as Monaco from "monaco-editor";
import React from "react";

import { CODE_FONT_FAMILY } from "@/common/constants/font";
import type { CE_CodeLanguage } from "@/compilation/types";
import { useTheme } from "@/theme/hooks";
import { getMonacoTheme } from "@/theme/monaco";

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
