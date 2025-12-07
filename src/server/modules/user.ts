import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import type { ISendEmailVerificationCodePostRequestBody } from "../common/types";
import { requestAsync } from "../request";
import type { ISignedUploadRequest } from "./file.types";
import type {
    IUserAvatarUploadFinishPostRequestBody,
    IUserAvatarUploadFinishPostResponse,
    IUserAvatarUploadRequestPostRequestBody,
    IUserDetailGetResponse,
    IUserDetailPatchRequestBody,
    IUserListGetRequestQuery,
    IUserListGetResponse,
} from "./user.types";

export async function getUserListAsync(query: IUserListGetRequestQuery) {
    return await requestAsync<IUserListGetResponse>({
        path: "user/list",
        method: "GET",
        query: {
            ...query,
        },
    });
}

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

export async function postUploadUserAvatarRequestAsync(
    id: string,
    body: IUserAvatarUploadRequestPostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync<ISignedUploadRequest>({
        path: `user/detail/${id}/avatar-upload-request`,
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.UserAvatarUpload),
    });
}

export async function postUploadUserAvatarFinishAsync(
    id: string,
    body: IUserAvatarUploadFinishPostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync<IUserAvatarUploadFinishPostResponse>({
        path: `user/detail/${id}/avatar-upload-finish`,
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.UserAvatarUpload),
    });
}
