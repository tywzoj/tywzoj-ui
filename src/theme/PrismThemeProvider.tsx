import React from "react";
import { Helmet } from "react-helmet-async";

import cssUrlDraculaHref from "@/assets/styles/prism-dracula.css?url";
import cssUrlOneLightHref from "@/assets/styles/prism-one-light.css?url";
import { neverGuard } from "@/common/utils/never-guard";

import { CE_Theme } from "./types";

export interface IPrismThemeProviderProps {
    theme: CE_Theme;
}

export const PrismThemeProvider: React.FC<IPrismThemeProviderProps> = (props) => {
    const { theme } = props;

    const themeCssUrl = React.useMemo(() => {
        switch (theme) {
            case CE_Theme.Light:
                return cssUrlOneLightHref;
            case CE_Theme.Dark:
                return cssUrlDraculaHref;
            default:
                neverGuard(theme);
        }
    }, [theme]);

    return (
        <Helmet>
            <link rel="stylesheet" href={themeCssUrl} />
        </Helmet>
    );
};
