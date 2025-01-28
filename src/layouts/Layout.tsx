import { makeStyles, tokens, Tooltip } from "@fluentui/react-components";
import { Book20Filled, GroupList20Filled, Home20Filled } from "@fluentui/react-icons";
import { Hamburger, NavDrawer, NavDrawerBody, NavDrawerHeader } from "@fluentui/react-nav-preview";
import { Outlet } from "@tanstack/react-router";
import type { JSX } from "react";
import React from "react";

import iconDark from "@/assets/icon.dark.png";
import iconLight from "@/assets/icon.light.png";
import titleDark from "@/assets/tywzoj.dark.svg";
import titleLight from "@/assets/tywzoj.light.svg";
import { flex } from "@/common/styles/flex";
import { commonLinkStyles } from "@/common/styles/link";
import type { NavTo } from "@/common/types/nav-to";
import { format } from "@/common/utils/format";
import { NavItemWithRouter } from "@/components/NavItemWithRouter";
import { useLocalizedStrings } from "@/locales/hooks";
import { getLocale } from "@/locales/selectors";
import { CE_Locale, CE_Strings } from "@/locales/types";
import { useAppSelector, useCurrentUser, useFeature, useIsSmallScreen, usePermission } from "@/store/hooks";
import { useIsLightTheme } from "@/theme/hooks";

import AuthMenu from "./AuthMenu";
import UserMenu from "./UserMenu";

const ACTIVE_ITEM_TAG = "active-nav-item";
const INACTIVE_ITEM_TAG = "inactive-nav-item";

export const Layout: React.FC = () => {
    const isSmallScreen = useIsSmallScreen();
    const isLightTheme = useIsLightTheme();
    const currentUser = useCurrentUser();
    const { recaptchaEnabled, domainIcpRecordInformation } = useFeature();
    const locale = useAppSelector(getLocale);
    const { accessProblem } = usePermission();

    const ls = useLocalizedStrings({
        navigationTitle: CE_Strings.NAVIGATION_LABEL,
        homePage: CE_Strings.NAVIGATION_HOME,
        problemsPage: CE_Strings.NAVIGATION_PROBLEMS,
        problemSetsPage: CE_Strings.NAVIGATION_PROBLEM_SETS,
        siteTitleAlt: CE_Strings.SITE_TITLE_IMAGE_ALT,
        siteIconAlt: CE_Strings.SITE_ICON_IMAGE_ALT,
        copyright: CE_Strings.COPYRIGHT_NOTICE,
        recaptcha: CE_Strings.GOOGLE_RECAPTCHA_NOTICE,
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
                            if (!isOverlay) {
                                userPreferOpen.current = !prev;
                            }
                            return !prev;
                        });
                    }}
                />
            </Tooltip>
        ),
        [isOverlay, ls.navigationTitle],
    );

    const createNavItem = (to: NavTo<typeof NavItemWithRouter>, text: string, icon: JSX.Element) => {
        return (
            <NavItemWithRouter
                key={to}
                to={to}
                icon={icon}
                activeProps={{ value: ACTIVE_ITEM_TAG }}
                inactiveProps={{ value: INACTIVE_ITEM_TAG + to }}
                onClick={() => {
                    if (isOverlay) {
                        setIsNavDrawerOpen(false);
                    }
                }}
            >
                {text}
            </NavItemWithRouter>
        );
    };

    return (
        <div className={styles.root}>
            <NavDrawer open={isNavDrawerOpen} type={isOverlay ? "overlay" : "inline"} selectedValue={ACTIVE_ITEM_TAG}>
                <NavDrawerHeader>{hamburger}</NavDrawerHeader>
                <NavDrawerBody>
                    {createNavItem("/", ls.homePage, <Home20Filled />)}
                    {accessProblem && createNavItem("/problem", ls.problemsPage, <Book20Filled />)}
                    {accessProblem && createNavItem("/set", ls.problemSetsPage, <GroupList20Filled />)}
                </NavDrawerBody>
            </NavDrawer>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerNavButton}>{!isNavDrawerOpen && hamburger}</div>
                    <div className={styles.headerInfo}>
                        <img
                            className={styles.headerInfoIcon}
                            src={isLightTheme ? iconLight : iconDark}
                            alt={ls.siteIconAlt}
                        />
                        <img
                            className={styles.headerInfoTitle}
                            src={isLightTheme ? titleLight : titleDark}
                            alt={ls.siteTitleAlt}
                        />
                    </div>
                    <div className={styles.headerRightMenu}>{currentUser ? <UserMenu /> : <AuthMenu />}</div>
                </div>
                <div className={styles.body}>
                    <div className={styles.content}>
                        <Outlet />
                    </div>
                    <div className={styles.footer}>
                        <div>{format(ls.copyright, new Date().getFullYear())}</div>
                        {recaptchaEnabled && <div dangerouslySetInnerHTML={{ __html: ls.recaptcha }} />}
                        {domainIcpRecordInformation && locale === CE_Locale.zh_cn && (
                            // for Chinese users, display the ICP record information
                            <div>
                                <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
                                    {domainIcpRecordInformation}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({ flexDirection: "row" }),
        width: "100%",
        height: "100%",
        minWidth: "360px",
        overflowY: "auto",
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
        padding: "0px 14px",
        boxSizing: "border-box",
        boxShadow: tokens.shadow4,
    },
    headerNavButton: {
        padding: "5px 0",
        minHeight: "30px",
        minWidth: "30px",
    },
    headerInfo: {
        ...flex({
            flexDirection: "row",
            alignItems: "center",
        }),
        padding: "5px 0",
        gap: "14px",
        height: "30px",
        overflow: "hidden",
    },
    headerInfoTitle: {
        height: "28px",
    },
    headerInfoIcon: {
        height: "40px",
    },
    headerRightMenu: {
        ...flex({
            justifyContent: "flex-end",
            alignItems: "center",
        }),
        height: "40px",
    },
    body: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        width: "100%",
        height: "100%",
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
    },
    footer: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        gap: "8px",
        padding: "0 20px 20px",
        ">div": {
            textAlign: "center",
            color: tokens.colorNeutralForeground3,
            fontSize: tokens.fontSizeBase200,
            lineHeight: tokens.lineHeightBase200,
        },
        "& a": {
            ...commonLinkStyles,
        },
    },
});

export default Layout;
