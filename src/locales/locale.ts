export const enum CE_Locale {
    en = "en",
    zh_cn = "zh-cn",
}

export const defaultLanguage = CE_Locale.zh_cn;

export const supportedLanguages: CE_Locale[] = [CE_Locale.en, CE_Locale.zh_cn];

export const rtlLanguages = [
    "ar", // Arabic
    "az", // Azerbaijani
    "dv", // Divehi
    "fa", // Persian
    "ff", // Fulah
    "he", // Hebrew
    "ku", // Central Kurdish
    "nqo", // N'ko
    "syr", // Syriac
    "ug", // Uyghur
    "ur", // Urdu
];

export const stringIdToRecaptchaLanguageMap: { [k in CE_Locale]: string } = {
    [CE_Locale.en]: "en",
    [CE_Locale.zh_cn]: "zh-CN",
};
