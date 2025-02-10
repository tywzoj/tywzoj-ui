import type { CE_Locale } from "./locale";

export interface ILocaleState {
    lang: CE_Locale;
    isRtl: boolean;
    strings: ILocalizedStrings;
}
