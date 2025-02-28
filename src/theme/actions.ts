import { createAction } from "@reduxjs/toolkit";

import { matchMediaDarkTheme } from "@/common/utils/theme-media-query";
import { createAppAction } from "@/store/utils";

import { CE_Theme } from "./types";

let callback: ((e: MediaQueryListEvent) => void) | undefined;

export const setThemeAction = createAction("Theme/Set", (theme: CE_Theme) => {
    return { payload: theme };
});

/**
 * Update the theme of the application
 * @param theme User's preferred theme, null to use system theme
 * @returns A action function to dispatch the theme
 */
export const updateThemeAction = createAppAction((theme: CE_Theme | null) => (dispatch) => {
    if (callback) {
        matchMediaDarkTheme.removeEventListener("change", callback);
        callback = undefined;
    }

    if (!theme) {
        theme = matchMediaDarkTheme.matches ? CE_Theme.Dark : CE_Theme.Light;
        callback = (e) => {
            const theme = e.matches ? CE_Theme.Dark : CE_Theme.Light;
            dispatch(setThemeAction(theme));
        };
    }

    dispatch(setThemeAction(theme));

    if (callback) {
        matchMediaDarkTheme.addEventListener("change", callback);
    }
});
