import { Body1Strong, makeStyles, mergeClasses, Spinner, Subtitle2 } from "@fluentui/react-components";
import React from "react";

import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { CodeBoxLazy } from "@/highlight/CodeBox.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { MarkdownContentLazy } from "@/markdown/MarkdownContent.lazy";
import type { IProblemContentDetail, IProblemSampleDetail } from "@/server/modules/problem.types";
import { useIsSmallScreen } from "@/store/hooks";

import { ProblemCard } from "./ProblemCard";

export interface IProblemContentProps {
    className?: string;
    content: IProblemContentDetail | null;
    samples: IProblemSampleDetail[];
}

export const ProblemContent: React.FC<IProblemContentProps> = (props) => {
    const { className, content, samples } = props;

    const styles = useStyles();

    const ls = useLocalizedStrings({
        description: CE_Strings.PROBLEM_DESCRIPTION_LABEL,
        inputFormat: CE_Strings.PROBLEM_INPUT_FORMAT_LABEL,
        outputFormat: CE_Strings.PROBLEM_OUTPUT_FORMAT_LABEL,
        limitAndHint: CE_Strings.PROBLEM_LIMIT_AND_HINT_LABEL,
        samples: CE_Strings.PROBLEM_SAMPLES_LABEL,
    });

    return (
        <div className={mergeClasses(styles.root, className)}>
            {content?.description && (
                <ProblemCard title={ls.description}>
                    <ProblemMarkdownContent content={content.description} />
                </ProblemCard>
            )}

            {content?.inputFormat && (
                <ProblemCard title={ls.inputFormat}>
                    <ProblemMarkdownContent content={content.inputFormat} />
                </ProblemCard>
            )}

            {content?.outputFormat && (
                <ProblemCard title={ls.outputFormat}>
                    <ProblemMarkdownContent content={content.outputFormat} />
                </ProblemCard>
            )}

            {samples.length > 0 && (
                <ProblemCard title={ls.samples}>
                    <div className={styles.sampleBoxContainer}>
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
                </ProblemCard>
            )}

            {content?.limitAndHint && (
                <ProblemCard title={ls.limitAndHint}>
                    <ProblemMarkdownContent content={content.limitAndHint} />
                </ProblemCard>
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

    const ls = useLocalizedStrings({
        sampleItem: CE_Strings.PROBLEM_SAMPLE_ITEM_LABEL,
        sampleI: CE_Strings.PROBLEM_SAMPLE_INPUT_LABEL,
        sampleO: CE_Strings.PROBLEM_SAMPLE_OUTPUT_LABEL,
        sampleE: CE_Strings.PROBLEM_SAMPLE_EXPLANATION_LABEL,
    });

    return (
        <div className={styles.sampleBox}>
            <Subtitle2 as="h3" className={styles.title}>
                {format(ls.sampleItem, index)}
            </Subtitle2>
            <div className={mergeClasses(styles.sampleIO, isSmallScreen && styles.sampleIOSingleLine)}>
                {input && (
                    <div className={styles.sampleItem}>
                        <Body1Strong as="h4" className={styles.title}>
                            {ls.sampleI}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={input} />
                        </React.Suspense>
                    </div>
                )}
                {output && (
                    <div className={styles.sampleItem}>
                        <Body1Strong as="h4" className={styles.title}>
                            {ls.sampleO}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={"test"} />
                        </React.Suspense>
                    </div>
                )}
            </div>
            {explanation && (
                <div className={styles.sampleItem}>
                    <Body1Strong as="h4" className={styles.title}>
                        {ls.sampleE}
                    </Body1Strong>
                    <ProblemMarkdownContent content={explanation} placeHolderLines={2} />
                </div>
            )}
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
    },
    title: {
        margin: "unset",
    },
    sampleBoxContainer: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
        width: "100%",
    },
    sampleBox: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
        width: "100%",
    },
    sampleIO: {
        ...flex(),
        gap: "8px",
        width: "100%",
    },
    sampleIOSingleLine: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
    },
    sampleItem: {
        maxWidth: "100%",
        flexGrow: 1,
        minWidth: "calc(50% - 4px)",
    },
});
