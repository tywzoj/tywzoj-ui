import { Body1Strong, makeStyles, mergeClasses, Spinner, Subtitle2 } from "@fluentui/react-components";
import React from "react";

import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { CodeBoxLazy } from "@/highlight/CodeBox.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { MarkdownContentLazy } from "@/markdown/MarkdownContent.lazy";
import type { IProblemContentDetail, IProblemSampleDetail } from "@/server/modules/problem.types";
import { useIsSmallScreen } from "@/store/hooks";

import { ContentCard } from "./ContentCard";

export interface IProblemContentProps {
    className?: string;
    content: IProblemContentDetail | null;
    samples: IProblemSampleDetail[];
}

export const ProblemContent: React.FC<IProblemContentProps> = (props) => {
    const { className, content, samples } = props;

    const styles = useStyles();
    const ls = useLocalizedStrings();

    return (
        <div className={mergeClasses(styles.$root, className)}>
            {content?.description && (
                <ContentCard title={ls.$PROBLEM_DESCRIPTION_LABEL}>
                    <ProblemMarkdownContent content={content.description} />
                </ContentCard>
            )}

            {content?.inputFormat && (
                <ContentCard title={ls.$PROBLEM_INPUT_FORMAT_LABEL}>
                    <ProblemMarkdownContent content={content.inputFormat} />
                </ContentCard>
            )}

            {content?.outputFormat && (
                <ContentCard title={ls.$PROBLEM_OUTPUT_FORMAT_LABEL}>
                    <ProblemMarkdownContent content={content.outputFormat} />
                </ContentCard>
            )}

            {samples.length > 0 && (
                <ContentCard title={ls.$PROBLEM_SAMPLES_LABEL}>
                    <div className={styles.$sampleBoxContainer}>
                        {samples.map((sample, index) => (
                            <ProblemSampleBox
                                key={sample.id}
                                index={index + 1}
                                input={sample.input}
                                output={sample.output}
                                explanation={sample.explanation}
                            />
                        ))}
                    </div>
                </ContentCard>
            )}

            {content?.limitAndHint && (
                <ContentCard title={ls.$PROBLEM_LIMIT_AND_HINT_LABEL}>
                    <ProblemMarkdownContent content={content.limitAndHint} />
                </ContentCard>
            )}
        </div>
    );
};

const ProblemMarkdownContent: React.FC<{
    content: string;
    placeHolderLines?: number;
}> = ({ content, placeHolderLines }) => {
    return (
        <React.Suspense fallback={<Spinner size="small" />}>
            <MarkdownContentLazy content={content} placeholderLines={placeHolderLines} />
        </React.Suspense>
    );
};

const ProblemSampleBox: React.FC<{
    index: number;
    input: string;
    output: string;
    explanation: string;
}> = ({ index, input, output, explanation }) => {
    const styles = useStyles();

    const isSmallScreen = useIsSmallScreen();

    const ls = useLocalizedStrings();

    return (
        <div className={styles.$sampleBox}>
            <Subtitle2 as="h3" className={styles.$title}>
                {format(ls.$PROBLEM_SAMPLE_ITEM_LABEL, index)}
            </Subtitle2>
            <div className={mergeClasses(styles.$sampleIO, isSmallScreen && styles.$sampleIOSingleLine)}>
                {input && (
                    <div className={styles.$sampleItem}>
                        <Body1Strong as="h4" className={styles.$title}>
                            {ls.$PROBLEM_SAMPLE_INPUT_LABEL}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={input} />
                        </React.Suspense>
                    </div>
                )}
                {output && (
                    <div className={styles.$sampleItem}>
                        <Body1Strong as="h4" className={styles.$title}>
                            {ls.$PROBLEM_SAMPLE_OUTPUT_LABEL}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={"test"} />
                        </React.Suspense>
                    </div>
                )}
            </div>
            {explanation && (
                <div className={styles.$sampleItem}>
                    <Body1Strong as="h4" className={styles.$title}>
                        {ls.$PROBLEM_SAMPLE_EXPLANATION_LABEL}
                    </Body1Strong>
                    <ProblemMarkdownContent content={explanation} placeHolderLines={1} />
                </div>
            )}
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
    },
    $title: {
        margin: "unset",
    },
    $sampleBoxContainer: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
        width: "100%",
    },
    $sampleBox: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
        width: "100%",
    },
    $sampleIO: {
        ...flex(),
        gap: "8px",
        width: "100%",
    },
    $sampleIOSingleLine: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
    },
    $sampleItem: {
        maxWidth: "100%",
        flexGrow: 1,
        minWidth: "calc(50% - 4px)",
    },
});
