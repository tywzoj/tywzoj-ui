import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import { requestAsync } from "../request";
import type {
    IAuthDetail,
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
