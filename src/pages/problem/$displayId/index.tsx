import {
    Button,
    makeStyles,
    Menu,
    MenuButton,
    MenuList,
    MenuPopover,
    MenuTrigger,
    mergeClasses,
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

import { ButtonGroup, firstButtonClassName, lastButtonClassName } from "@/common/components/ButtonGroup";
import type { IButtonWithRouterProps } from "@/common/components/ButtonWithRouter";
import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import type { IMenuItemLinkWithRouterProps } from "@/common/components/MenuItemLinkWithRouter";
import { MenuItemLinkWithRouter } from "@/common/components/MenuItemLinkWithRouter";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { ContentCard } from "@/components/ContentCard";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { ProblemContent } from "@/components/ProblemContent";
import { ProblemSubmissionDialog } from "@/components/ProblemSubmissionDialog";
import { ProblemTag } from "@/components/ProblemTag";
import { VisibilityLabel } from "@/components/VisibilityLabel";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import type { IProblemDetail, IProblemTagDetail } from "@/server/modules/problem.types";
import { withThrowErrors } from "@/server/utils";
import { setPreferenceAction } from "@/store/actions";
import { useAppDispatch, useAppSelector, useIsMiddleScreen, useIsSmallScreen, usePermission } from "@/store/hooks";
import { getPreference } from "@/store/selectors";

const ProblemDetailPage: React.FC = () => {
    const { queryOptions } = Route.useLoaderData();
    const { data: problem } = useSuspenseQueryData(queryOptions);
    const { tags, content, samples } = problem;

    const isMiddleScreen = useIsMiddleScreen();
    const permission = usePermission();
    const [isSubmissionDialogOpen, setIsSubmissionDialogOpen] = React.useState(false);

    const styles = useStyles();

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
                    {isMiddleScreen && (
                        <ProblemActions problem={problem} onSubmit={() => setIsSubmissionDialogOpen(true)} />
                    )}

                    <ProblemContent content={content} samples={samples} />
                </div>

                <div className={styles.rightColumn}>
                    {!isMiddleScreen && (
                        <ProblemActions problem={problem} onSubmit={() => setIsSubmissionDialogOpen(true)} />
                    )}

                    <ProblemTags tags={tags} />
                </div>
            </div>
            {permission.submitAnswer && (
                <ProblemSubmissionDialog
                    isOpen={isSubmissionDialogOpen}
                    onClose={() => setIsSubmissionDialogOpen(false)}
                    onSubmit={() => {}}
                />
            )}
        </div>
    );
};

const ProblemTags: React.FC<{
    tags: IProblemTagDetail[];
}> = ({ tags }) => {
    const { showTagsOnProblemDetail } = useAppSelector(getPreference);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const ls = useLocalizedStrings({
        tags: CE_Strings.PROBLEM_TAGS_LABEL,
        showTags: CE_Strings.SHOW_TAGS_LABEL,
        hideTags: CE_Strings.HIDE_TAGS_LABEL,
        noTags: CE_Strings.NO_TAGS_TEXT,
    });

    const styles = useStyles();
    return (
        <ContentCard
            title={ls.tags}
            action={
                <Tooltip content={showTagsOnProblemDetail ? ls.hideTags : ls.showTags} relationship="label">
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
        </ContentCard>
    );
};

type IProblemActionSharedProps = { key: string; content: string };
type IProblemActionButtonProps = IProblemActionSharedProps & IButtonWithRouterProps;
type IProblemActionMenuItemProps = IProblemActionSharedProps & IMenuItemLinkWithRouterProps;
type IProblemActionProps = { overflow?: boolean } & (IProblemActionButtonProps | IProblemActionMenuItemProps);

const ProblemActions: React.FC<{
    problem: IProblemDetail;
    onSubmit: () => void;
}> = ({ problem, onSubmit: onSubmission }) => {
    const styles = useStyles();
    const isMiddleScreen = useIsMiddleScreen();
    const isSmallScreen = useIsSmallScreen();
    const isVertical = !isMiddleScreen;
    const permission = usePermission();

    const actionPropsList = React.useMemo<IProblemActionProps[]>(() => {
        const displayId = String(problem.displayId);

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
            to: "/problem/$displayId/files",
            params: { displayId },
            icon: <DocumentTextFilled />,
            content: "Files",
            overflow: isSmallScreen,
        });

        if (permission.manageProblem) {
            items.push(
                {
                    key: "edit",
                    to: "/problem/$displayId/edit",
                    params: { displayId },
                    icon: <EditFilled />,
                    content: "Edit",
                    overflow: isMiddleScreen,
                },
                {
                    key: "judge",
                    to: "/problem/$displayId/judge",
                    params: { displayId },
                    icon: <TaskListSquareSettingsFilled />,
                    content: "Judgement Settings",
                    overflow: isMiddleScreen,
                },
            );
        }

        return items;
    }, [problem, isSmallScreen, permission.manageProblem, isMiddleScreen]);

    const buttonPropsList: IProblemActionButtonProps[] = React.useMemo(
        () => actionPropsList.filter(({ overflow }) => isVertical || !overflow) as IProblemActionButtonProps[],
        [actionPropsList, isVertical],
    );
    const menuItemPropsList: IProblemActionMenuItemProps[] = React.useMemo(
        () => actionPropsList.filter(({ overflow }) => !isVertical && overflow) as IProblemActionMenuItemProps[],
        [actionPropsList, isVertical],
    );
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
    tagContainer: {
        ...flex({
            flexWrap: "wrap",
        }),
        gap: "4px",
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

const queryOptionsFn = createQueryOptionsFn(
    CE_QueryId.ProblemDetail,
    withThrowErrors(ProblemModule.getProblemDetailAsync),
);

export const Route = createFileRoute("/problem/$displayId/")({
    component: ProblemDetailPage,
    errorComponent: ErrorPageLazy,
    loader: async ({ context: { queryClient, store }, params: { displayId } }) => {
        const { showTagsOnProblemDetail } = getPreference(store.getState());

        const queryOptions = queryOptionsFn(displayId, {
            queryTags: showTagsOnProblemDetail,
        });

        await queryClient.ensureQueryData(queryOptions);

        return { queryOptions };
    },
});
