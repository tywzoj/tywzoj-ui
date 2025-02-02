/* eslint-disable @typescript-eslint/ban-ts-comment */
import MarkdownIt from "markdown-it";
// @ts-ignore
import MarkdownItMath from "markdown-it-math-loose";
// @ts-ignore
import MarkdownItMergeCells from "markdown-it-merge-cells/src";
import { v4 as uuid4 } from "uuid";

import type {
    IMarkdownHighlightPlaceholder,
    IMarkdownMathPlaceholder,
    IMarkdownRenderResult,
    IMarkdownRenderResultEventData,
    IMarkdownRenderTaskEventData,
} from "./types";
import { generatePlaceholder } from "./utils";

function renderMarkdown(text: string, onPatchRenderer?: (renderer: MarkdownIt) => void): IMarkdownRenderResult {
    // Use a <span> placeholder for highlights and maths
    // They're replaced after HTML sanitation

    const highlightPlaceholders: IMarkdownHighlightPlaceholder[] = [];
    const mathPlaceholders: IMarkdownMathPlaceholder[] = [];

    const renderer = new MarkdownIt({
        html: true,
        breaks: false,
        linkify: true,
        typographer: true,
        highlight: (code, lang) => {
            const id = uuid4();
            highlightPlaceholders.push({
                id,
                code,
                lang,
            });

            return `<pre><code>${generatePlaceholder(id)}</code></pre>`;
        },
    });

    renderer.use(MarkdownItMath, {
        inlineOpen: "$",
        inlineClose: "$",
        blockOpen: "$$",
        blockClose: "$$",
        inlineRenderer: (math: string) => {
            const id = uuid4();
            mathPlaceholders.push({
                id,
                math,
                display: false,
            });

            return generatePlaceholder(id);
        },
        blockRenderer: (math: string) => {
            const id = uuid4();
            mathPlaceholders.push({
                id,
                math,
                display: true,
            });

            return generatePlaceholder(id);
        },
    });

    renderer.use(MarkdownItMergeCells);

    onPatchRenderer?.(renderer);

    return {
        html: renderer.render(text),
        highlightPlaceholders,
        mathPlaceholders,
    };
}

self.onmessage = (event: MessageEvent<IMarkdownRenderTaskEventData>) => {
    const { id, markdown, onPatchRenderer } = event.data;
    let msg: IMarkdownRenderResultEventData;
    try {
        msg = {
            id,
            success: true,
            result: renderMarkdown(markdown, onPatchRenderer),
        };
    } catch (error) {
        msg = { id, success: false, error };
    }
    self.postMessage(msg);
};
