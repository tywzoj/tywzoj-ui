export { default as CE_Strings } from "./locale.strings";

export const enum CE_Locale {
    en = "en",
    zh_cn = "zh-cn",
}

export interface ILocaleState {
    lang: CE_Locale;
    isRtl: boolean;
    strings: ILocalizedStrings;
}
