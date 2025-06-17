import type { CE_Locale } from "@/locales/locale";

import type { CE_Order } from "./enums";

export interface IListRequest<ISortBy extends string> {
    order: CE_Order;
    skipCount: number;
    takeCount: number;
    sortBy: ISortBy;
}

export interface ICommonIdRequestParam {
    id: number;
}

export interface ISendEmailVerificationCodePostRequestBody {
    email: string;
    lang: CE_Locale;
}
