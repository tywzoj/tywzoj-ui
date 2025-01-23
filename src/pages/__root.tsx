import { makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { BookQuestionMark20Filled, Home20Filled } from "@fluentui/react-icons";
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader } from "@fluentui/react-nav-preview";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { JSX } from "react";
import React from "react";

import { ErrorPage } from "@/components/ErrorPage";
import { NavItemWithRouter } from "@/components/NavItemWithRouter";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { useIsSmallScreen } from "@/store/hooks";
import type { IAppStore } from "@/store/types";
import { flex } from "@/utils/flex";

const ACTIVE_ITEM_TAG = "active";

const Layout: React.FC = () => {
    const isSmallScreen = useIsSmallScreen();

    const ls = useLocalizedStrings({
        navigationTitle: CE_Strings.NAVIGATION_LABEL,
        homePage: CE_Strings.NAVIGATION_HOME,
    });

    const styles = useStyles();

    const [isNavDrawerOpen, setIsNavDrawerOpen] = React.useState(!isSmallScreen);
    const [isOverlay, setIsOverlay] = React.useState(isSmallScreen);
    const userPreferOpen = React.useRef(true);

    React.useEffect(() => {
        if (isSmallScreen) {
            // Auto close the drawer when the screen size is small.
            setIsNavDrawerOpen(false);
        } else {
            setIsNavDrawerOpen(userPreferOpen.current);
        }

        // Directly use isSmallScreen for overlay will trigger an error about aria-hidden when drawer is open.
        // So we need close the drawer first, and then we can set the isOverlay state.
        setIsOverlay(isSmallScreen);
    }, [isSmallScreen]);

    const hamburger = React.useMemo(
        () => (
            <Tooltip content={ls.navigationTitle} relationship="label">
                <Hamburger
                    onClick={() => {
                        setIsNavDrawerOpen((prev) => {
                            userPreferOpen.current = !prev;
                            return !prev;
                        });
                    }}
                />
            </Tooltip>
        ),
        [ls.navigationTitle],
    );

    return (
        <div className={styles.root}>
            <NavDrawer open={isNavDrawerOpen} type={isOverlay ? "overlay" : "inline"} selectedValue={ACTIVE_ITEM_TAG}>
                <NavDrawerHeader>{hamburger}</NavDrawerHeader>
                <NavDrawerBody>
                    {createNavItem("/", ls.homePage, <Home20Filled />)}
                    {createNavItem("/about", "About", <BookQuestionMark20Filled />)} {/* TODO: will remove this line */}
                </NavDrawerBody>
            </NavDrawer>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerNavButton}>{!isNavDrawerOpen && hamburger}</div>
                    <div className={styles.headerInfo}></div>
                    <div className={styles.headerRightMenu}></div>
                </div>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <Outlet />
                    </div>
                    <div className={styles.footer}>Test</div>
                </div>
            </div>
        </div>
    );
};

const NotFound: React.FC = () => {
    const [message] = useLocalizedStrings(CE_Strings.CUSTOM_ERROR_PAGE_NOT_FOUND);
    return <ErrorPage message={message} />;
};

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
    store: IAppStore;
}>()({
    component: Layout,
    notFoundComponent: NotFound,
});

const useStyles = makeStyles({
    root: {
        ...flex({ flexDirection: "row" }),
        width: "100%",
        height: "100%",
    },
    container: {
        ...flex({ flexDirection: "column" }),
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
    },
    header: {
        ...flex({ flexDirection: "row", justifyContent: "space-between" }),
        minHeight: "40px",
        padding: "5px 24px 5px 14px",
        boxSizing: "border-box",
        boxShadow: tokens.shadow4,
    },
    headerNavButton: {},
    headerInfo: {},
    headerInfoTitle: {},
    headerInfoLogo: {},
    headerRightMenu: {},
    body: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        width: "100%",
        boxSizing: "border-box",
        overflow: "auto",
    },
    content: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        flexGrow: 1,
        padding: "20px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "1200px",
        ">div": {
            width: "100%",
            height: "3000px",
        },
    },
    footer: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        height: "40px",
    },
});

function createNavItem(to: string, text: string, icon: JSX.Element) {
    return (
        <NavItemWithRouter to={to} icon={icon} activeProps={{ value: ACTIVE_ITEM_TAG }} inactiveProps={{ value: to }}>
            {text}
        </NavItemWithRouter>
    );
}
