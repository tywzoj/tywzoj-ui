import { neverGuard } from "@/common/utils/never-guard";

import { CE_Theme } from "./types";

export const enum CE_MonacoTheme {
    OneLight = "one-light",
    Dracula = "dracula",
}

export function getMonacoTheme(theme: CE_Theme): CE_MonacoTheme {
    switch (theme) {
        case CE_Theme.Light:
            return CE_MonacoTheme.OneLight;
        case CE_Theme.Dark:
            return CE_MonacoTheme.Dracula;
        default:
            neverGuard(theme);
    }
}
