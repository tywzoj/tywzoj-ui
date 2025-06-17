import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import type { ISendEmailVerificationCodePostRequestBody } from "../common/types";
import { requestAsync } from "../request";
import type { IUserDetailGetResponse, IUserDetailPatchRequestBody } from "./user.types";

export async function getUserDetailAsync(id: string) {
    return await requestAsync<IUserDetailGetResponse>({
        path: `user/detail/${id}`,
        method: "GET",
    });
}

export async function patchUserDetailAsync(
    id: string,
    body: IUserDetailPatchRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync({
        path: `user/detail/${id}`,
        method: "PATCH",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.UserDetailPatch),
    });
}

export async function postSendChangeEmailCodeAsync(
    body: ISendEmailVerificationCodePostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync({
        path: `user/send-change-detail-email-verification-code`,
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.UserSendChangeEmailCode),
    });
}
