import { makeStyles, mergeClasses, Tab, TabList } from "@fluentui/react-components";
import { createFileRoute, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import React from "react";

import { PermissionDeniedError } from "@/common/exceptions/permission-denied";
import { SignInRequiredError } from "@/common/exceptions/sign-in-required";
import { flex } from "@/common/styles/flex";
import { Z_ID } from "@/common/validators/common";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { checkIsAllowedEditUserId } from "@/permission/user/checker";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { AuthModule, UserModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";
import { useIsMiniScreen } from "@/store/hooks";

const enum CE_SettingPages {
    EditProfile = "edit",
    Security = "security",
    Preference = "preference",
}

const SettingLayout: React.FC = () => {
    const navigate = useNavigate();
    const matchRoute = useMatchRoute();
    const isMiniScreen = useIsMiniScreen();

    const [selectedTab, setSelectedTab] = React.useState<CE_SettingPages>(CE_SettingPages.Preference);
    const checkMatch = (page: CE_SettingPages) => matchRoute({ to: `/user/$id/${page}` }) && setSelectedTab(page);

    // Fuck! Tanstack Router designed this like shit!
    React.useEffect(() => {
        checkMatch(CE_SettingPages.Preference);
        checkMatch(CE_SettingPages.EditProfile);
        checkMatch(CE_SettingPages.Security);
    });

    const ls = useLocalizedStrings({
        $edit: CE_Strings.USER_EDIT_PAGE_TITLE,
        $preference: CE_Strings.USER_PREFERENCE_PAGE_TITLE,
        $security: CE_Strings.USER_SECURITY_PAGE_TITLE,
    });

    const styles = useStyles();

    return (
        <div className={styles.root}>
            <div>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(_, { value }) => {
                        navigate({ to: `../${value}` });
                    }}
                    vertical={isMiniScreen}
                >
                    <Tab value={CE_SettingPages.Preference}>{ls.$preference}</Tab>
                    <Tab value={CE_SettingPages.EditProfile}>{ls.$edit}</Tab>
                    <Tab value={CE_SettingPages.Security}>{ls.$security}</Tab>
                </TabList>
            </div>

            <div className={mergeClasses(styles.content, isMiniScreen && styles.contentMiniScreen)}>
                <Outlet />
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        maxWidth: "800px",
        gap: "16px",
    },
    content: {
        padding: "0 16px",
    },
    contentMiniScreen: {
        marginTop: "8px",
        padding: "0",
    },
});

const authDetailQueryOptionsFn = createQueryOptionsFn(
    CE_QueryId.AuthDetail,
    withThrowErrors(AuthModule.getAuthDetailAsync),
);
const userDetailQueryOptionsFn = createQueryOptionsFn(
    CE_QueryId.UserDetail,
    withThrowErrors(UserModule.getUserDetailAsync),
);

export const Route = createFileRoute("/user/$id/_setting-layout")({
    component: SettingLayout,
    errorComponent: ErrorPageLazy,
    beforeLoad: ({ context: { currentUser, permission }, params: { id } }) => {
        if (!currentUser) {
            throw new SignInRequiredError();
        }

        const userId = Z_ID.parse(id);
        if (!checkIsAllowedEditUserId(userId, currentUser, permission)) {
            throw new PermissionDeniedError();
        }
    },
    loader: async ({ context: { queryClient }, params: { id } }) => {
        const userDetailQueryOptions = userDetailQueryOptionsFn(id);
        const authDetailQueryOptions = authDetailQueryOptionsFn(id);

        await Promise.all([
            queryClient.ensureQueryData(userDetailQueryOptions),
            queryClient.ensureQueryData(authDetailQueryOptions),
        ]);

        return { userDetailQueryOptions, authDetailQueryOptions };
    },
});
