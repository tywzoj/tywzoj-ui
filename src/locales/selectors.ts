import { createAppSelector } from "@/store/utils";

export const getLocale = createAppSelector((state) => state.locale.lang);
export const getIsRtl = createAppSelector((state) => state.locale.isRtl);
export const getStrings = createAppSelector((state) => state.locale.strings);
