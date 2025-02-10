import { createAction } from "@reduxjs/toolkit";

import type { IAppDispatch } from "@/store/types";
import { createAppAction } from "@/store/utils";

import type { CE_Locale } from "./locale";
import type { ILocaleState } from "./types";
import { checkIsRtl, getBrowserPreferLanguage, loadLocaleStringsAsync } from "./utils";

export const setLocaleAction = createAction("Locale/Set", (props: Partial<ILocaleState>) => ({ payload: props }));

/**
 * Update the locale of the application
 * @param locale User's preferred locale, null to use browser's preferred locale
 * @returns A action function to dispatch the locale
 */
export const updateLocaleAsyncAction = createAppAction((locale: CE_Locale | null) => async (dispatch: IAppDispatch) => {
    if (!locale) {
        locale = getBrowserPreferLanguage();
    }

    dispatch(setLocaleAction({ lang: locale, isRtl: checkIsRtl(locale) }));
    dispatch(setLocaleAction({ strings: await loadLocaleStringsAsync(locale) }));
    window.document.documentElement.lang = locale;
});
