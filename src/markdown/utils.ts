import { parseUrlIfSameOrigin } from "@/common/utils/url";
import { loadHighlighter } from "@/highlight/highlighter.lazy";
import { loadMathRenderer } from "@/math/renderer.lazy";

import { MarkdownRenderer } from "./renderer";
import { sanitize } from "./sanitize";

export function findPlaceholderElement(wrapperElement: HTMLElement, id: string): HTMLSpanElement | null {
    return wrapperElement.querySelector(`[data-id="${id}"]`);
}

export async function renderMarkdownAsync(content: string, noSanitize: boolean): Promise<string> {
    const { html, mathPlaceholders, highlightPlaceholders } = await MarkdownRenderer.getInstance().render(content);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = noSanitize ? html : sanitize(html);

    // Render highlights
    if (highlightPlaceholders.length > 0) {
        const { highlight } = await loadHighlighter();

        for (const item of highlightPlaceholders) {
            const element = findPlaceholderElement(wrapper, item.id);
            if (element) {
                const cls = `language-${item.lang}`;
                if (element.parentElement) {
                    element.parentElement.className = cls; // <code>
                    if (element.parentElement.parentElement) {
                        element.parentElement.parentElement.className = cls; // <pre>
                    }
                }
                element.outerHTML = highlight(item.code, item.lang);
            }
        }
    }

    // Render maths
    if (mathPlaceholders.length > 0) {
        const { MathRenderer } = await loadMathRenderer();
        const renderer = MathRenderer.getInstance();

        await Promise.all(
            mathPlaceholders.map(async (item) => {
                const element = findPlaceholderElement(wrapper, item.id);
                if (element) {
                    element.outerHTML = await renderer.render(item.math, item.display);
                }
            }),
        );
    }

    // Patch <a> tags for security reason
    Array.from(wrapper.getElementsByTagName("a")).forEach((a) => {
        a.relList.add("noreferrer", "noreferrer");
        if (!parseUrlIfSameOrigin(a.href)) a.target = "_blank";
    });

    return wrapper.innerHTML;
}
