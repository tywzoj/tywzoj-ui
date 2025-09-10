import {
    Image,
    Link,
    makeStyles,
    mergeClasses,
    Spinner,
    Subtitle1,
    Subtitle2,
    Tooltip,
} from "@fluentui/react-components";
import { EditFilled } from "@fluentui/react-icons";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

import logoDark from "@/assets/icon.dark.png";
import logoLight from "@/assets/icon.light.png";
import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { format } from "@/common/utils/format";
import { ContentCard } from "@/components/ContentCard";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { UserLevelLabel } from "@/components/UserLevelLabel";
import { useLocalizedStrings } from "@/locales/hooks";
import { MarkdownContentLazy } from "@/markdown/MarkdownContent.lazy";
import { useIsAllowedEditUser } from "@/permission/user/hooks";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { UserModule } from "@/server/api";
import type { UserTypes } from "@/server/types";
import { withThrowErrors } from "@/server/utils";
import { useFeature, useIsMiddleScreen, useIsMiniScreen } from "@/store/hooks";
import { useIsLightTheme } from "@/theme/hooks";

const UserDetailPage: React.FC = () => {
    const { queryOptions } = Route.useLoaderData();
    const { data: userDetail } = useSuspenseQueryData(queryOptions);
    const isMiddleScreen = useIsMiddleScreen();
    const { renderMarkdownInUserBio } = useFeature();

    const ls = useLocalizedStrings();

    useSetPageTitle(format(ls.$USER_PROFILE_PAGE_TITLE_WITH_NAME, userDetail.username));

    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.$root, isMiddleScreen && styles.$rootSingleColumn)}>
            <div className={styles.$leftColumn}>
                <AvatarAndUserName userDetail={userDetail} />

                {userDetail.email && (
                    <ContentCard title={ls.$EMAIL_LABEL} small={!isMiddleScreen}>
                        <Link href={`mailto:${userDetail.email}`}>{userDetail.email}</Link>
                    </ContentCard>
                )}
            </div>

            <div className={styles.$rightColumn}>
                {userDetail.bio && (
                    <ContentCard title={ls.$USER_BIO_LABEL}>
                        {renderMarkdownInUserBio ? (
                            <React.Suspense fallback={<Spinner />}>
                                <MarkdownContentLazy content={userDetail.bio} />
                            </React.Suspense>
                        ) : (
                            <Subtitle2>{userDetail.bio}</Subtitle2>
                        )}
                    </ContentCard>
                )}
            </div>
        </div>
    );
};

const AvatarAndUserName: React.FC<{
    userDetail: UserTypes.IUserDetail;
}> = ({ userDetail }) => {
    const isMiniScreen = useIsMiniScreen();
    const isMiddleScreen = useIsMiddleScreen();
    const isLightTheme = useIsLightTheme();
    const isAllowedEdit = useIsAllowedEditUser(userDetail);

    const fallBackAvatar = isLightTheme ? logoLight : logoDark;
    const styles = useStyles();

    const ls = useLocalizedStrings();

    return (
        <ContentCard>
            <div className={mergeClasses(styles.$avatarCard, isMiddleScreen && styles.$avatarCardTopRow)}>
                <div className={styles.$avatarContainer}>
                    <div className={styles.$avatar}>
                        <Image
                            bordered
                            shape="rounded"
                            src={userDetail.avatar || fallBackAvatar}
                            alt={ls.$USER_AVATAR_LABEL}
                        />
                    </div>
                </div>
                <div className={mergeClasses(styles.$avatarCardLeft, !isMiddleScreen && styles.$avatarCardRow)}>
                    <div className={styles.$usernameContainer}>
                        <Tooltip
                            content={userDetail.nickname ? ls.$USER_NICKNAME_LABEL : ls.$USERNAME_LABEL}
                            relationship="description"
                            withArrow
                            positioning={isMiddleScreen ? "before" : "after"}
                        >
                            <Subtitle1 as="span" wrap={false} truncate>
                                {userDetail.nickname || userDetail.username}
                            </Subtitle1>
                        </Tooltip>
                        {userDetail.nickname ? (
                            <Tooltip
                                content={ls.$USERNAME_LABEL}
                                relationship="description"
                                withArrow
                                positioning={isMiddleScreen ? "before" : "after"}
                            >
                                <Subtitle2 as="span" wrap={false} truncate>
                                    {userDetail.username}
                                </Subtitle2>
                            </Tooltip>
                        ) : null}
                    </div>
                </div>
                <div className={mergeClasses(styles.$avatarCardRight, !isMiddleScreen && styles.$avatarCardRow)}>
                    <UserLevelLabel
                        userLevel={userDetail.level}
                        tooltipPositioning={isMiddleScreen ? "before" : "after"}
                    />

                    {isAllowedEdit &&
                        (isMiniScreen ? (
                            <Tooltip content={ls.$COMMON_EDIT_BUTTON} relationship="label">
                                <ButtonWithRouter
                                    icon={<EditFilled />}
                                    to={"/user/$id/edit"}
                                    params={{
                                        id: userDetail.id.toString(),
                                    }}
                                />
                            </Tooltip>
                        ) : (
                            <ButtonWithRouter
                                icon={<EditFilled />}
                                to={"/user/$id/edit"}
                                params={{
                                    id: userDetail.id.toString(),
                                }}
                            >
                                {ls.$COMMON_EDIT_BUTTON}
                            </ButtonWithRouter>
                        ))}
                </div>
            </div>
        </ContentCard>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex(),
        gap: "20px",
        width: "100%",
        maxWidth: "100%",
        minWidth: "0",
    },
    $rootSingleColumn: {
        ...flex({
            flexDirection: "column",
        }),
    },
    $leftColumn: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
        flexShrink: 1,
        flex: 1,
        minWidth: "0",
    },
    $rightColumn: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
        flex: 2.5,
        minWidth: "0",
    },
    $avatarCard: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "4px 20px",
        width: "100%",
    },
    $avatarCardTopRow: {
        ...flex({
            justifyContent: "space-between",
            alignItems: "center",
        }),
        gap: "20px",
        width: "100%",
    },
    $avatarContainer: {
        position: "relative",
        "&:before": {
            content: '""',
            display: "block",
            paddingTop: "100%",
        },
        flex: 1,
        minWidth: "75px",
    },
    $avatar: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        "> .fui-Image": {
            width: "100%",
            height: "100%",
        },
    },
    $avatarCardLeft: {
        ...flex({
            flexDirection: "row",
            alignItems: "center",
        }),
        flex: 3,
        gap: "0 20px",
        minWidth: "0",
    },
    $avatarCardRight: {
        ...flex({
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
        }),
        flex: 1,
        flexShrink: 1,
        minWidth: "fit-content",
        gap: "8px",
    },
    $avatarCardRow: {
        ...flex({
            flexDirection: "column",
        }),
        flex: 1,
    },
    $usernameContainer: {
        ...flex({
            flexDirection: "column",
            alignItems: "flex-start",
        }),
        width: "100%",
        "> span": {
            overflow: "hidden",
        },
    },
});

const queryOptionsFn = createQueryOptionsFn(CE_QueryId.UserDetail, withThrowErrors(UserModule.getUserDetailAsync));

export const Route = createFileRoute("/user/$id/")({
    component: UserDetailPage,
    errorComponent: ErrorPageLazy,
    loader: async ({ context: { queryClient }, params: { id } }) => {
        const queryOptions = queryOptionsFn(id);

        await queryClient.ensureQueryData(queryOptions);

        return { queryOptions };
    },
});
