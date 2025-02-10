import type { CE_ErrorCode } from "@/server/common/error-code";

import type { CE_Locale } from "./locale";
import { CE_Strings, defaultLanguage, errorToStringIdMap, rtlLanguages, supportedLanguages } from "./locale";

export function checkIsRtl(locale: CE_Locale) {
    return rtlLanguages.findIndex((l) => locale.startsWith(l)) >= 0;
}

export function getBrowserPreferLanguage(): CE_Locale {
    if (!navigator?.languages) return defaultLanguage;

    const navigatorLanguages =
        typeof navigator.languages === "string" ? [navigator.languages] : [...navigator.languages];

    navigatorLanguages.forEach((lang, index) => (navigatorLanguages[index] = lang.trim().toLowerCase()));

    // Strict match
    for (const language of navigatorLanguages) {
        const lang = supportedLanguages.find((value) => value === language || value === language.split("-")[0]);
        if (lang) {
            return lang;
        }
    }

    return defaultLanguage;
}

export async function loadLocaleStringsAsync(locale: CE_Locale): Promise<ILocalizedStrings> {
    const modules = await import(`../assets/locales/strings.${locale}.js`);
    return modules.default;
}

/**
 * Get localized string from redux store, with fallback to empty string.
 * @param strings Localized strings object from redux store.
 * @param id The id of the localized string
 * @param fallback Fallback string if the id is not found. Default to empty string.
 * @returns Localized string or fallback string.
 */
export function getLocalizedStringWithFallback<T extends CE_Strings>(
    strings: ILocalizedStrings,
    id: T,
): ILocalizedStrings[T];
export function getLocalizedStringWithFallback<T extends CE_Strings, V extends string>(
    strings: ILocalizedStrings,
    id: T,
    fallback: V,
): ILocalizedStrings[T] | V;
export function getLocalizedStringWithFallback(strings: ILocalizedStrings, id: CE_Strings, fallback = "") {
    if (id in strings) {
        return strings[id] ?? fallback;
    } else {
        return fallback;
    }
}

export function getStringIdFromErrorCode(errorCode: CE_ErrorCode): CE_Strings {
    if (errorCode in errorToStringIdMap) {
        return errorToStringIdMap[errorCode];
    } else {
        return CE_Strings.ERROR_1000_UNKNOWN_ERROR;
    }
}
