import {
    Body1Strong,
    Card,
    CardHeader,
    makeStyles,
    mergeClasses,
    Spinner,
    Subtitle1,
    Subtitle2,
    Text,
    Title3,
    ToggleButton,
    Tooltip,
} from "@fluentui/react-components";
import { TagFilled, TagOffFilled } from "@fluentui/react-icons";
import { createFileRoute, useMatch, useRouter, useRouterState } from "@tanstack/react-router";
import React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { ProblemTag } from "@/components/ProblemTag";
import { VisibilityLabel } from "@/components/VisibilityLabel";
import { CodeBoxLazy } from "@/highlight/CodeBox.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { MarkdownContentLazy } from "@/markdown/MarkdownContent.lazy";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";
import { setPreferenceAction } from "@/store/actions";
import { useAppDispatch, useAppSelector, useIsMiddleScreen, useIsSmallScreen } from "@/store/hooks";
import { getPreference } from "@/store/selectors";

const ProblemDetailPage: React.FC = () => {
    const problem = Route.useLoaderData();
    const { tags, content, samples } = problem;
    const { showTagsOnProblemDetail } = useAppSelector(getPreference);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isMiddleScreen = useIsMiddleScreen();

    const styles = useStyles();

    const ls = useLocalizedStrings({
        description: CE_Strings.PROBLEM_DESCRIPTION_LABEL,
        inputFormat: CE_Strings.PROBLEM_INPUT_FORMAT_LABEL,
        outputFormat: CE_Strings.PROBLEM_OUTPUT_FORMAT_LABEL,
        limitAndHint: CE_Strings.PROBLEM_LIMIT_AND_HINT_LABEL,
        samples: CE_Strings.PROBLEM_SAMPLES_LABEL,
        tags: CE_Strings.PROBLEM_TAGS_LABEL,
        showTags: CE_Strings.SHOW_TAGS_LABEL,
        hideTags: CE_Strings.HIDE_TAGS_LABEL,
        noTags: CE_Strings.NO_TAGS_TEXT,
    });

    useSetPageTitle(`#${problem.displayId}.${problem.title}`);

    // TODO: Add submission button
    // TODO: Add manage button
    // TODO: Add edit button
    // TODO: Add delete button
    // TODO: Add file button

    return (
        <div className={styles.root}>
            <div className={styles.titleContainer}>
                <Title3 as="h1">
                    #{problem.displayId}. {problem.title}
                </Title3>
                <VisibilityLabel visibility={problem.visibility} />
            </div>
            <div className={mergeClasses(styles.content, isMiddleScreen && styles.oneLineContent)}>
                <div className={styles.leftColumn}>
                    {content && (
                        <>
                            <ProblemCard condition={content.description} title={ls.description}>
                                <ProblemContent content={content.description} />
                            </ProblemCard>

                            <ProblemCard condition={content.inputFormat} title={ls.inputFormat}>
                                <ProblemContent content={content.inputFormat} />
                            </ProblemCard>

                            <ProblemCard condition={content.outputFormat} title={ls.outputFormat}>
                                <ProblemContent content={content.outputFormat} />
                            </ProblemCard>
                        </>
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

                    <ProblemCard condition={content?.limitAndHint} title={ls.limitAndHint}>
                        <ProblemContent content={content!.limitAndHint} />
                    </ProblemCard>
                </div>
                <div className={styles.rightColumn}>
                    <ProblemCard
                        title={ls.tags}
                        action={
                            <Tooltip content={showTagsOnProblemDetail ? ls.hideTags : ls.showTags}>
                                <ToggleButton
                                    appearance="transparent"
                                    icon={showTagsOnProblemDetail ? <TagFilled /> : <TagOffFilled />}
                                    checked={showTagsOnProblemDetail}
                                    onClick={() => {
                                        const preShowTagsOnProblemDetail = showTagsOnProblemDetail;
                                        dispatch(
                                            setPreferenceAction({
                                                showTagsOnProblemDetail: !preShowTagsOnProblemDetail,
                                            }),
                                        );
                                        if (!preShowTagsOnProblemDetail) {
                                            router.invalidate();
                                        }
                                    }}
                                />
                            </Tooltip>
                        }
                    >
                        <div className={styles.tagContainer}>
                            {showTagsOnProblemDetail
                                ? tags.map((tag) => <ProblemTag key={tag.id} name={tag.name} color={tag.color} />)
                                : null}
                        </div>
                    </ProblemCard>
                </div>
            </div>
        </div>
    );
};

const ProblemCard: React.FC<
    React.PropsWithChildren<{
        title: string;
        action?: React.ReactNode;
        condition?: unknown;
    }>
> = ({ title, action, condition = true, children }) => {
    const styles = useStyles();

    return condition ? (
        <Card className={styles.card}>
            <CardHeader
                header={
                    <Subtitle1 as="h2" className={styles.cardTitle}>
                        {title}
                    </Subtitle1>
                }
                action={action}
            />
            <div className={styles.cardContent}>{children}</div>
        </Card>
    ) : null;
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
            <Subtitle2 as="h3" className={styles.cardTitle}>
                {format(ls.sampleItem, index)}
            </Subtitle2>
            <div className={mergeClasses(styles.sampleIO, isSmallScreen && styles.sampleIOSingleLine)}>
                {input && (
                    <div className={styles.sampleIOItem}>
                        <Body1Strong as="h4" className={styles.cardTitle}>
                            {ls.sampleI}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={input} lang="plaintext" />
                        </React.Suspense>
                    </div>
                )}
                {output && (
                    <div className={styles.sampleIOItem}>
                        <Body1Strong as="h4" className={styles.cardTitle}>
                            {ls.sampleO}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={"test"} lang="plaintext" />
                        </React.Suspense>
                    </div>
                )}
            </div>
            {explanation && (
                <div>
                    <Body1Strong as="h4" className={styles.cardTitle}>
                        {ls.sampleE}
                    </Body1Strong>
                    <ProblemContent content={explanation} />
                </div>
            )}
        </div>
    );
};

const ProblemContent: React.FC<{ content: string }> = ({ content }) => {
    return (
        <React.Suspense fallback={<Spinner size="small" />}>
            <MarkdownContentLazy content={content} />
        </React.Suspense>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        minWidth: "0",
    },
    titleContainer: {
        ...flex({
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
        }),
        width: "100%",
        gap: "14px",
        ">h1": {
            margin: "unset",
            textAlign: "center",
        },
        marginBottom: "20px",
    },
    content: {
        ...flex(),
        gap: "20px",
        boxSizing: "border-box",
        maxWidth: "100%",
        minWidth: "0",
    },
    oneLineContent: {
        ...flex({
            flexDirection: "column",
        }),
    },
    leftColumn: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
        boxSizing: "border-box",
        flexShrink: 1,
        flex: 2.5,
        minWidth: "0",
    },
    rightColumn: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
        boxSizing: "border-box",
        flex: 1,
        minWidth: "0",
    },
    card: {
        width: "100%",
        boxSizing: "border-box",
    },
    cardTitle: {
        margin: "unset",
    },
    cardContent: {
        width: "100%",
    },
    tagContainer: {
        ...flex({
            flexWrap: "wrap",
        }),
        gap: "4px",
    },
    sampleBoxContainer: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "8px",
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
    sampleIOItem: {
        maxWidth: "100%",
        flex: 1,
        minWidth: "50%",
    },
});

const queryOptions = createQueryOptions(CE_QueryId.ProblemDetail, withThrowErrors(ProblemModule.getProblemDetailAsync));

export const Route = createFileRoute("/problem/$displayId")({
    component: ProblemDetailPage,
    errorComponent: ErrorPageLazy,
    loader: async ({ context: { queryClient, store }, params: { displayId } }) => {
        const { showTagsOnProblemDetail } = getPreference(store.getState());

        const { data } = await queryClient.ensureQueryData(
            queryOptions(displayId, {
                queryTags: showTagsOnProblemDetail,
            }),
        );

        return data;
    },
});
