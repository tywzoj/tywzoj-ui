import { makeStyles } from "@fluentui/react-components";
import type React from "react";

import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { flex } from "@/common/styles/flex";
import { useLocalizedStrings } from "@/locales/hooks";
import { useIsMiniScreen } from "@/store/hooks";

export const AuthMenu: React.FC = () => {
    const isMiniScreen = useIsMiniScreen();

    const ls = useLocalizedStrings();

    const url = new URL(window.location.href);
    const redirect =
        url.pathname === "/sign-in" || url.pathname === "/sign-out"
            ? url.searchParams.get("redirect") || undefined
            : url.pathname + url.search + url.hash;

    const styles = useStyles();

    return (
        <div className={styles.$root}>
            <ButtonWithRouter
                className={styles.$button}
                to="/sign-in"
                search={{ redirect }}
                appearance="primary"
                preload="viewport"
            >
                {ls.$NAVIGATION_SIGN_IN}
            </ButtonWithRouter>
            {!isMiniScreen && (
                <ButtonWithRouter className={styles.$button} search={{ redirect }} to="/sign-up">
                    {ls.$NAVIGATION_SIGN_UP}
                </ButtonWithRouter>
            )}
        </div>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({}),
        gap: "8px",
    },
    $button: {
        minWidth: "unset",
    },
});

export default AuthMenu;
