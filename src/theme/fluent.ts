import { webDarkTheme, webLightTheme } from "@fluentui/react-components";

import { neverGuard } from "@/common/utils/never-guard";

import { CE_Theme } from "./types";

export function getFluentTheme(theme: CE_Theme) {
    switch (theme) {
        case CE_Theme.Light:
            return webLightTheme;
        case CE_Theme.Dark:
            return webDarkTheme;
        default:
            neverGuard(theme);
    }
}
