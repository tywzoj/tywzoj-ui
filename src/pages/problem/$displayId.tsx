import {
    Body1Strong,
    Button,
    Card,
    CardHeader,
    makeStyles,
    Menu,
    MenuButton,
    MenuList,
    MenuPopover,
    MenuTrigger,
    mergeClasses,
    Spinner,
    Subtitle1,
    Subtitle2,
    Title3,
    ToggleButton,
    tokens,
    Tooltip,
} from "@fluentui/react-components";
import {
    CodeFilled,
    DocumentTextFilled,
    EditFilled,
    MoreHorizontalFilled,
    TagFilled,
    TagOffFilled,
    TaskListLtrFilled,
    TaskListSquareSettingsFilled,
} from "@fluentui/react-icons";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { ButtonGroup, firstButtonClassName, lastButtonClassName } from "@/components/ButtonGroup";
import type { IButtonWithRouterProps } from "@/components/ButtonWithRouter";
import { ButtonWithRouter } from "@/components/ButtonWithRouter";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import type { IMenuItemLinkWithRouterProps } from "@/components/MenuItemLinkWithRouter";
import { MenuItemLinkWithRouter } from "@/components/MenuItemLinkWithRouter";
import { ProblemTag } from "@/components/ProblemTag";
import { VisibilityLabel } from "@/components/VisibilityLabel";
import { CodeBoxLazy } from "@/highlight/CodeBox.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { MarkdownContentLazy } from "@/markdown/MarkdownContent.lazy";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import type { IProblemDetail } from "@/server/modules/problem.types";
import { withThrowErrors } from "@/server/utils";
import { setPreferenceAction } from "@/store/actions";
import { useAppDispatch, useAppSelector, useIsMiddleScreen, useIsSmallScreen, usePermission } from "@/store/hooks";
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
                    {isMiddleScreen && <ProblemActions problem={problem} />}

                    {content?.description && (
                        <ProblemCard title={ls.description}>
                            <ProblemContent content={content.description} />
                        </ProblemCard>
                    )}

                    {content?.inputFormat && (
                        <ProblemCard title={ls.inputFormat}>
                            <ProblemContent content={content.inputFormat} />
                        </ProblemCard>
                    )}

                    {content?.outputFormat && (
                        <ProblemCard title={ls.outputFormat}>
                            <ProblemContent content={content.outputFormat} />
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
                            <ProblemContent content={content.limitAndHint} />
                        </ProblemCard>
                    )}
                </div>

                <div className={styles.rightColumn}>
                    {!isMiddleScreen && <ProblemActions problem={problem} />}

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
    }>
> = ({ title, action, children }) => {
    const styles = useStyles();

    return (
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
            <Subtitle2 as="h3" className={styles.cardTitle}>
                {format(ls.sampleItem, index)}
            </Subtitle2>
            <div className={mergeClasses(styles.sampleIO, isSmallScreen && styles.sampleIOSingleLine)}>
                {input && (
                    <div className={styles.sampleItem}>
                        <Body1Strong as="h4" className={styles.cardTitle}>
                            {ls.sampleI}
                        </Body1Strong>
                        <React.Suspense fallback={<Spinner size="small" />}>
                            <CodeBoxLazy code={input} />
                        </React.Suspense>
                    </div>
                )}
                {output && (
                    <div className={styles.sampleItem}>
                        <Body1Strong as="h4" className={styles.cardTitle}>
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
                    <Body1Strong as="h4" className={styles.cardTitle}>
                        {ls.sampleE}
                    </Body1Strong>
                    <ProblemContent content={explanation} placeHolderLines={2} />
                </div>
            )}
        </div>
    );
};

const ProblemContent: React.FC<{ content: string; placeHolderLines?: number }> = ({ content, placeHolderLines }) => {
    return (
        <React.Suspense fallback={<Spinner size="small" />}>
            <MarkdownContentLazy content={content} placeholderLines={placeHolderLines} />
        </React.Suspense>
    );
};

type IProblemActionProps = {
    key: string;
    content: string;
    overflow?: boolean;
} & (IButtonWithRouterProps | IMenuItemLinkWithRouterProps);

const ProblemActions: React.FC<{
    problem: IProblemDetail;
    onSubmission?: () => void;
}> = ({ problem, onSubmission }) => {
    const styles = useStyles();
    const isMiddleScreen = useIsMiddleScreen();
    const isSmallScreen = useIsSmallScreen();
    const isVertical = !isMiddleScreen;
    const permission = usePermission();

    const actionPropsList = React.useMemo<IProblemActionProps[]>(() => {
        const strId = String(problem.id);

        const items: IProblemActionProps[] = [];

        items.push({
            key: "submission",
            to: "/submission",
            search: { pid: problem.id },
            icon: <TaskListLtrFilled />,
            content: "Submissions",
        });

        // TODO: check file exists
        items.push({
            key: "files",
            to: "/problem/$id/files",
            params: { id: strId },
            icon: <DocumentTextFilled />,
            content: "Files",
            overflow: isSmallScreen,
        });

        if (permission.manageProblem) {
            items.push(
                {
                    key: "edit",
                    to: "/problem/$id/edit",
                    params: { id: strId },
                    icon: <EditFilled />,
                    content: "Edit",
                    overflow: isMiddleScreen,
                },
                {
                    key: "judge",
                    to: "/problem/$id/judge",
                    params: { id: strId },
                    icon: <TaskListSquareSettingsFilled />,
                    content: "Judgement Settings",
                    overflow: isMiddleScreen,
                },
            );
        }

        return items;
    }, [problem.id, isSmallScreen, permission.manageProblem, isMiddleScreen]);

    const buttonPropsList: IProblemActionProps[] = actionPropsList.filter(({ overflow }) => isVertical || !overflow);
    const menuItemPropsList: IProblemActionProps[] = actionPropsList.filter(({ overflow }) => !isVertical && overflow);
    const showOverflow = !isVertical && menuItemPropsList.length > 0;

    return (
        <ButtonGroup
            vertical={isVertical}
            className={isVertical ? styles.buttonGroupVertical : styles.buttonGroupHorizontal}
        >
            {permission.submitAnswer && (
                <Button
                    className={mergeClasses(firstButtonClassName, isVertical && styles.submitButton)}
                    onClick={onSubmission}
                    shape="square"
                    appearance="primary"
                    icon={<CodeFilled />}
                >
                    Submit
                </Button>
            )}

            {buttonPropsList.map(({ key, content, ...props }, index) => (
                <ButtonWithRouter
                    {...props}
                    shape="square"
                    key={key}
                    className={!showOverflow && index === buttonPropsList.length - 1 ? lastButtonClassName : undefined}
                >
                    {content}
                </ButtonWithRouter>
            ))}

            {showOverflow && (
                <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <Tooltip content="More" relationship="label">
                            <MenuButton className={lastButtonClassName} icon={<MoreHorizontalFilled />} />
                        </Tooltip>
                    </MenuTrigger>

                    <MenuPopover>
                        <MenuList>
                            {menuItemPropsList.map(({ key, content, ...props }) => (
                                <MenuItemLinkWithRouter {...props} key={key}>
                                    {content}
                                </MenuItemLinkWithRouter>
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
            )}
        </ButtonGroup>
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
        flexShrink: 1,
        flex: 2.5,
        minWidth: "0",
    },
    rightColumn: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
        flex: 1,
        minWidth: "0",
    },
    card: {
        width: "100%",
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
    buttonGroupVertical: {
        width: "100%",
        "& button, & a": {
            ...flex({
                alignItems: "center",
            }),
            gap: tokens.spacingHorizontalM,
            minWidth: "fit-content",
            width: "100%",
        },
    },
    buttonGroupHorizontal: {
        ...flex({
            flexWrap: "nowrap",
        }),
    },
    submitButton: {
        height: "40px",
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
