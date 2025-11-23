import { makeStyles, mergeClasses, Tab, TabList } from "@fluentui/react-components";
import { createFileRoute, Outlet, useMatchRoute, useNavigate } from "@tanstack/react-router";
import * as React from "react";

import { PermissionDeniedError } from "@/common/exceptions/permission-denied";
import { flex } from "@/common/styles/flex";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { isAdminUser } from "@/permission/common/checker";
import { useIsMiddleScreen, useIsMiniScreen } from "@/store/hooks";

const enum CE_AdminPages {
    Dashboard = "dashboard",
    Users = "user",
    BatchSignUp = "batch-signup",
    Rejudge = "rejudge",
    JudgeClient = "judge-client",
    Links = "link",
}

const Layout: React.FC = () => {
    const navigate = useNavigate();
    const matchRoute = useMatchRoute();
    const isMiddleScreen = useIsMiddleScreen();
    const isMiniScreen = useIsMiniScreen();

    const [selectedTab, setSelectedTab] = React.useState<CE_AdminPages>(CE_AdminPages.Dashboard);
    const checkMatch = (page: CE_AdminPages) => matchRoute({ to: `/admin/${page}` }) && setSelectedTab(page);

    React.useEffect(() => {
        checkMatch(CE_AdminPages.Dashboard);
        checkMatch(CE_AdminPages.JudgeClient);
    });

    const styles = useStyles();

    return (
        <div className={mergeClasses(styles.$root, isMiddleScreen && !isMiniScreen && styles.$rootMiddleScreen)}>
            <div>
                <TabList
                    selectedValue={selectedTab}
                    onTabSelect={(_, { value }) => {
                        navigate({ to: `../${value}` });
                    }}
                    vertical={isMiddleScreen}
                >
                    <Tab value={CE_AdminPages.Dashboard}>Dashboard</Tab>
                    <Tab value={CE_AdminPages.Users}>Users</Tab>
                    <Tab value={CE_AdminPages.BatchSignUp}>Batch Sign-up</Tab>
                    <Tab value={CE_AdminPages.Rejudge}>Rejudge</Tab>
                    <Tab value={CE_AdminPages.JudgeClient}>Judge Client</Tab>
                    <Tab value={CE_AdminPages.Links}>Links</Tab>
                </TabList>
            </div>

            <div
                className={mergeClasses(
                    styles.$content,
                    isMiddleScreen && styles.$contentMiddleScreen,
                    isMiniScreen && styles.$contentMiniScreen,
                )}
            >
                <Outlet />
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        maxWidth: "800px",
        gap: "16px",
    },
    $rootMiddleScreen: {
        ...flex({
            flexDirection: "row",
        }),
    },
    $content: {
        padding: "0 16px",
    },
    $contentMiddleScreen: {
        marginTop: "6px",
    },
    $contentMiniScreen: {
        marginTop: "8px",
        padding: "0",
    },
});

export const Route = createFileRoute("/admin/_layout")({
    component: Layout,
    errorComponent: ErrorPageLazy,
    beforeLoad: ({ context: { currentUser } }) => {
        if (!currentUser || !isAdminUser(currentUser.level)) {
            throw new PermissionDeniedError();
        }
    },
});
