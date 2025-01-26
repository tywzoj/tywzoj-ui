import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import { requestAsync } from "../request";
import type { ISessionInfoGetResponse, ISignInPostRequestBody, ISignInPostResponse } from "./auth.types";

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
