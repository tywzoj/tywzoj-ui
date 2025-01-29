import {
    Body1Strong,
    Card,
    CardHeader,
    makeStyles,
    mergeClasses,
    Subtitle1,
    Subtitle2,
    Text,
    Title3,
    ToggleButton,
} from "@fluentui/react-components";
import { TagFilled, TagOff20Filled } from "@fluentui/react-icons";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { ProblemTag } from "@/components/ProblemTag";
import { VisibilityLabel } from "@/components/VisibilityLabel";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";
import { setPreferenceAction } from "@/store/actions";
import { useAppDispatch, useAppSelector, useIsMiddleScreen } from "@/store/hooks";
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
    });

    useSetPageTitle(`#${problem.displayId}.${problem.title}`);

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
                                <Text>{content.description}</Text>
                            </ProblemCard>

                            <ProblemCard condition={content.inputFormat} title={ls.inputFormat}>
                                <Text>{content.inputFormat}</Text>
                            </ProblemCard>

                            <ProblemCard condition={content.outputFormat} title={ls.outputFormat}>
                                <Text>{content.outputFormat}</Text>
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
                        <Text>{content!.limitAndHint}</Text>
                    </ProblemCard>
                </div>
                <div className={styles.rightColumn}>
                    <ProblemCard
                        title={ls.tags}
                        action={
                            <ToggleButton
                                appearance="transparent"
                                icon={showTagsOnProblemDetail ? <TagFilled /> : <TagOff20Filled />}
                                checked={showTagsOnProblemDetail}
                                onClick={() => {
                                    dispatch(
                                        setPreferenceAction({
                                            showTagsOnProblemDetail: !showTagsOnProblemDetail,
                                        }),
                                    );
                                    router.invalidate();
                                }}
                            />
                        }
                    >
                        <div className={styles.tagContainer}>
                            {tags.map((tag) => (
                                <ProblemTag key={tag.id} name={tag.name} color={tag.color} />
                            ))}
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
            <div className={styles.sampleIO}>
                <div>
                    <Body1Strong as="h4" className={styles.cardTitle}>
                        {ls.sampleI}
                    </Body1Strong>
                    <div>{input}</div>
                </div>
                {output && (
                    <div>
                        <Body1Strong as="h4" className={styles.cardTitle}>
                            {ls.sampleO}
                        </Body1Strong>
                        <div>{output}</div>
                    </div>
                )}
            </div>
            {explanation && (
                <div>
                    <Body1Strong as="h4" className={styles.cardTitle}>
                        {ls.sampleE}
                    </Body1Strong>
                    <div>{explanation}</div>
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
        width: "100%",
        minWidth: "0",
    },
    titleContainer: {
        ...flex({
            flexDirection: "row",
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
        ...flex({
            flexDirection: "row",
        }),
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
            flexDirection: "row",
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
        ...flex({
            flexDirection: "row",
        }),
        gap: "8px",
        width: "100%",
        "> div": {
            maxWidth: "100%",
            flex: 1,
        },
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
