import type { CE_Locale } from "./locale";
import { defaultLanguage, rtlLanguages, supportedLanguages } from "./locale";

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
