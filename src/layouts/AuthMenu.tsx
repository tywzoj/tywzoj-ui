import { makeStyles } from "@fluentui/react-components";
import { useRouterState } from "@tanstack/react-router";
import type React from "react";

import { flex } from "@/common/styles/flex";
import { ButtonWithRouter } from "@/components/ButtonWithRouter";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { useIsMiniScreen } from "@/store/hooks";

export const AuthMenu: React.FC = () => {
    const currentHref = useRouterState({
        select: (state) => state.location.href,
    });

    const isMiniScreen = useIsMiniScreen();

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
                search={{ redirect: currentHref }}
                appearance="primary"
                preload="viewport"
            >
                {ls.signIn}
            </ButtonWithRouter>
            {!isMiniScreen && (
                <ButtonWithRouter className={styles.button} to="/sign-up" preload={false}>
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
