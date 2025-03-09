import type { CE_Locale } from "@/locales/locale";

import { requestAsync } from "../request";
import type { IUserDetailGetResponse, IUserDetailPatchRequestBody } from "./user.types";

export async function getUserDetailAsync(id: string) {
    return await requestAsync<IUserDetailGetResponse>({
        path: `user/detail/${id}`,
        method: "GET",
    });
}

export async function patchUserDetailAsync(id: string, body: IUserDetailPatchRequestBody) {
    return await requestAsync({
        path: `user/detail/${id}`,
        method: "PATCH",
        body,
    });
}

export async function sendChangeEmailCodeAsync(email: string, locale: CE_Locale) {
    return await requestAsync({
        path: `user/send-change-detail-email-verification-code`,
        method: "POST",
        body: { email, lang: locale },
    });
}
