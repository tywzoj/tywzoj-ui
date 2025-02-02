import { mergeClasses, Skeleton, SkeletonItem, Text, useId } from "@fluentui/react-components";
import { useNavigate } from "@tanstack/react-router";
import type MarkdownIt from "markdown-it";
import React from "react";

import { useAsyncFunctionResult } from "@/common/hooks/async-value";
import { randomChoice, randomPartitionIntWithMin } from "@/common/utils/random";
import { range } from "@/common/utils/range";
import { parseUrlIfSameOrigin } from "@/common/utils/url";

import { useMarkdownRenderStyles } from "./MarkdownContent.styles";
import { renderMarkdownAsync } from "./utils";

export interface IMarkdownContentProps {
    className?: string;
    content: string;
    /**
     * If `true`, the content will not be sanitized.
     * @default false
     */
    noSanitize?: boolean;
    /**
     * Placeholder lines for the content.
     * @default 4
     */
    placeholderLines?: number;

    onPatchRenderer?: (renderer: MarkdownIt) => void;
    onPatchResult?: (element: HTMLDivElement) => (() => void) | void;
}

export const MarkdownContent: React.FC<IMarkdownContentProps> = React.memo((props) => {
    const { className, content, noSanitize = false, placeholderLines = 4, onPatchRenderer, onPatchResult } = props;
    const [wrapperElement, setWrapperElement] = React.useState<HTMLDivElement | null>();

    const {
        result: html,
        error,
        pending,
    } = useAsyncFunctionResult(renderMarkdownAsync, [content, noSanitize, onPatchRenderer]);
    const navigate = useNavigate();

    const styles = useMarkdownRenderStyles();

    React.useEffect(() => {
        if (!wrapperElement) return;

        const cleanCallbacks: ((() => void) | void)[] = [];

        // Fix internal links with dynamic generated `<a>` will NOT trigger router navigation
        function onLinkClick(e: MouseEvent) {
            const targetElement = e.target as HTMLElement;
            if (targetElement.tagName === "A") {
                const a = targetElement as HTMLAnchorElement;
                if (!["", "_self"].includes(a.target.toLowerCase())) return;

                const url = parseUrlIfSameOrigin(a.href);
                if (url) {
                    e.preventDefault();
                    navigate({
                        href: url.pathname + url.search + url.hash,
                    });
                }
            }
        }

        wrapperElement.addEventListener("click", onLinkClick);
        cleanCallbacks.push(() => wrapperElement.removeEventListener("click", onLinkClick));

        // Call patcher
        if (onPatchResult && wrapperElement) cleanCallbacks.push(onPatchResult(wrapperElement));

        return () => cleanCallbacks.forEach((fn) => fn?.());
    }, [navigate, onPatchResult, wrapperElement]);

    return pending ? (
        <Placeholder lines={placeholderLines} />
    ) : error ? (
        <Text>{content}</Text>
    ) : (
        <div
            className={mergeClasses(styles.root, className)}
            dangerouslySetInnerHTML={{ __html: html! }}
            ref={setWrapperElement}
        />
    );
});
MarkdownContent.displayName = "MarkdownContent";

const Placeholder: React.FC<{ lines: number }> = ({ lines }) => {
    const styles = useMarkdownRenderStyles();
    const id = useId("markdown-content-placeholder");

    return (
        <Skeleton className={styles.placeholder}>
            {range(0, lines).map((line) => {
                const widths = randomPartitionIntWithMin(
                    100 /* total */,
                    randomChoice(1, 2, 3, 4, 5),
                    10 /* minValue */,
                );

                return (
                    <div key={`${id}-${line}`} className={styles.placeholderLine}>
                        {widths.map((width, index) => (
                            <SkeletonItem key={`${id}-${line}-${index}-${width}`} style={{ width: `${width}%` }} />
                        ))}
                    </div>
                );
            })}
        </Skeleton>
    );
};

export default MarkdownContent;
