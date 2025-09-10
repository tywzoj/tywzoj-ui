import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import type { ISendEmailVerificationCodePostRequestBody } from "../common/types";
import { requestAsync } from "../request";
import type {
    IAuthDetail,
    IChangeEmailPostRequestBody,
    IResetPasswordPostRequestBody,
    ISendNewEmailVerificationCodePostRequestBody,
    ISessionInfoGetResponse,
    ISignInPostRequestBody,
    ISignInPostResponse,
    ISignOutPostResponse,
} from "./auth.types";

export async function getSessionInfoAsync() {
    return await requestAsync<ISessionInfoGetResponse>({
        path: "auth/session-info",
        method: "GET",
    });
}

export async function postSignInAsync(body: ISignInPostRequestBody, recaptchaAsync: IRecaptchaAsync) {
    return await requestAsync<ISignInPostResponse>({
        path: "auth/sign-in",
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.SignIn),
    });
}

export async function postSignOutAsync() {
    return await requestAsync<ISignOutPostResponse>({
        path: "auth/sign-out",
        method: "POST",
    });
}

export async function getAuthDetailAsync(id: string) {
    return await requestAsync<IAuthDetail>({
        path: `auth/detail/${id}`,
        method: "GET",
    });
}

export async function postSendChangeEmailVerificationCodeAsync(
    body: ISendEmailVerificationCodePostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync({
        path: "auth/send-change-email-verification-code",
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.EmailVerificationCode),
    });
}

export async function postSendNewEmailVerificationCodeAsync(
    body: ISendNewEmailVerificationCodePostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync({
        path: "auth/send-new-email-verification-code",
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.EmailVerificationCode),
    });
}

export async function postChangeEmailAsync(body: IChangeEmailPostRequestBody, recaptchaAsync: IRecaptchaAsync) {
    return await requestAsync({
        path: "auth/change-email",
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ChangeAuthEmail),
    });
}

export async function postResetPasswordAsync(body: IResetPasswordPostRequestBody, recaptchaAsync: IRecaptchaAsync) {
    return await requestAsync({
        path: "auth/reset-password",
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ResetAuthPassword),
    });
}
