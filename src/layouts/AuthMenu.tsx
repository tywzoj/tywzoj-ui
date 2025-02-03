import { makeStyles } from "@fluentui/react-components";
import { useRouterState } from "@tanstack/react-router";
import type React from "react";

import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { flex } from "@/common/styles/flex";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { useIsMiniScreen } from "@/store/hooks";

export const AuthMenu: React.FC = () => {
    const isMiniScreen = useIsMiniScreen();

    const currentHref = useRouterState({ select: (state) => state.location.href });
    const currentRedirect = useRouterState({ select: (state) => state.location.search?.redirect });
    const currentPath = useRouterState({ select: (state) => state.location.pathname });
    const shouldNotRedirect = currentPath === "/sign-in" || currentPath === "/sign-up";

    const ls = useLocalizedStrings({
        signIn: CE_Strings.NAVIGATION_SIGN_IN,
        signUp: CE_Strings.NAVIGATION_SIGN_UP,
    });

    const styles = useStyles();

    return (
        <div className={styles.root}>
            <ButtonWithRouter
                className={styles.button}
                to="/sign-in"
                search={{ redirect: shouldNotRedirect ? currentRedirect : currentHref }}
                appearance="primary"
                preload="viewport"
            >
                {ls.signIn}
            </ButtonWithRouter>
            {!isMiniScreen && (
                <ButtonWithRouter className={styles.button} to="/sign-up">
                    {ls.signUp}
                </ButtonWithRouter>
            )}
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({}),
        gap: "8px",
    },
    button: {
        minWidth: "unset",
    },
});

export default AuthMenu;
