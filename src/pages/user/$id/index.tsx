import { Image, makeStyles, mergeClasses, Subtitle1 } from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import logoDark from "@/assets/icon.dark.png";
import logoLight from "@/assets/icon.light.png";
import { flex } from "@/common/styles/flex";
import { ContentCard } from "@/components/ContentCard";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { UserModule } from "@/server/api";
import type { UserTypes } from "@/server/types";
import { withThrowErrors } from "@/server/utils";
import { useIsMiddleScreen, useIsMiniScreen } from "@/store/hooks";
import { useIsLightTheme } from "@/theme/hooks";

const UserDetailPage: React.FC = () => {
    const { queryOptions } = Route.useLoaderData();
    const { data: userDetail } = useSuspenseQueryData(queryOptions);
    const isMiddleScreen = useIsMiddleScreen();

    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.root, isMiddleScreen && styles.rootSingleColumn)}>
            {isMiddleScreen ? <TopRow userDetail={userDetail} /> : <LeftColumn userDetail={userDetail} />}
            <div className={styles.mainContent}>
                <ContentCard title="User Info">
                    <div></div>
                </ContentCard>
            </div>
        </div>
    );
};

const LeftColumn: React.FC<{
    userDetail: UserTypes.IUserDetail;
}> = ({ userDetail }) => {
    const styles = useStyles();

    return (
        <div className={styles.leftColumn}>
            <ContentCard>
                <UserAvatar src={userDetail.avatar} />
            </ContentCard>

            <ContentCard>
                <div>
                    <div>
                        <Subtitle1>{userDetail.username}</Subtitle1>
                    </div>
                </div>
            </ContentCard>
        </div>
    );
};

const TopRow: React.FC<{
    userDetail: UserTypes.IUserDetail;
}> = ({ userDetail }) => {
    const styles = useStyles();

    const isMiniScreen = useIsMiniScreen();

    return (
        <div className={styles.topRow}>
            <ContentCard
                className={mergeClasses(styles.topRowAvatarCard, isMiniScreen && styles.topRowAvatarCardNoPadding)}
            >
                <UserAvatar src={userDetail.avatar} bordered={!isMiniScreen} />
            </ContentCard>

            <ContentCard className={styles.topRowUserInfoCard}>
                <div>
                    <div>
                        <Subtitle1>{userDetail.username}</Subtitle1>
                    </div>
                </div>
            </ContentCard>
        </div>
    );
};

const UserAvatar: React.FC<{
    src: string | null;
    bordered?: boolean;
}> = ({ src, bordered = true }) => {
    const isLightTheme = useIsLightTheme();
    const fallBackAvatar = isLightTheme ? logoLight : logoDark;
    const styles = useStyles();

    return (
        <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
                <Image bordered={bordered} shape="rounded" src={src || fallBackAvatar} />
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex(),
        gap: "20px",
        width: "100%",
        maxWidth: "100%",
        minWidth: "0",
    },
    rootSingleColumn: {
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
        flex: 1,
        minWidth: "0",
    },
    topRow: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "20px",
        width: "100%",
        minWidth: "0",
    },
    mainContent: {
        ...flex({
            flexDirection: "column",
        }),
        gap: "20px",
        flex: 2.5,
        minWidth: "0",
    },
    avatarContainer: {
        position: "relative",
        "&:before": {
            content: '""',
            display: "block",
            paddingTop: "100%",
        },
    },
    avatar: {
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
    topRowAvatarCard: {
        flexShrink: 1,
        flex: 1,
        minWidth: "0",
        width: "unset",
        minHeight: "fit-content",
    },
    topRowAvatarCardNoPadding: {
        padding: "1px",
    },
    topRowUserInfoCard: {
        flex: 2.5,
        minWidth: "0",
        width: "unset",
        minHeight: "fit-content",
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
