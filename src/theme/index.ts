import { setThemeAction as setThemeAction } from "@/store/actions";
import type { IAppDispatch } from "@/store/types";

import { setPrismTheme } from "./prism";
import { setGlobalTheme } from "./theme";
import { CE_Theme } from "./types";

function setTheme(theme: CE_Theme) {
    setGlobalTheme(theme);
    setPrismTheme(theme);
}

const matchMediaDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
let callback: (e: MediaQueryListEvent) => void;

export const initThemeAction = () => (dispatch: IAppDispatch) => {
    const theme = matchMediaDarkTheme.matches ? CE_Theme.Dark : CE_Theme.Light;
    setTheme(theme);
    dispatch(setThemeAction(theme));
    callback = (e) => {
        const theme = e.matches ? CE_Theme.Dark : CE_Theme.Light;
        setTheme(theme);
        dispatch(setThemeAction(theme));
    };
    matchMediaDarkTheme.addEventListener("change", callback);
};

export const updateThemeAction = (theme: CE_Theme) => (dispatch: IAppDispatch) => {
    matchMediaDarkTheme.removeEventListener("change", callback);
    setTheme(theme);
    dispatch(setThemeAction(theme));
};
