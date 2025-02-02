import type MarkdownIt from "markdown-it";

export interface IMarkdownHighlightPlaceholder {
    readonly id: string;
    readonly code: string;
    readonly lang: string;
}

export interface IMarkdownMathPlaceholder {
    readonly id: string;
    readonly math: string;
    readonly display: boolean;
}

export interface IMarkdownRenderResult {
    readonly html: string;
    readonly highlightPlaceholders: IMarkdownHighlightPlaceholder[];
    readonly mathPlaceholders: IMarkdownMathPlaceholder[];
}

export interface IMarkdownRenderTaskEventData {
    readonly id: string;
    readonly markdown: string;
    readonly onPatchRenderer?: (renderer: MarkdownIt) => void;
}

export type IMarkdownRenderResultEventData = { readonly id: string } & (
    | { readonly success: true; readonly result: IMarkdownRenderResult }
    | { readonly success: false; readonly error: unknown }
);
