import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import { requestAsync } from "../request";
import type { ISignedUploadRequest } from "./file.types";
import type { CE_ProblemFileType } from "./problem.enums";
import type {
    IProblemContentDetailPatchRequestBody,
    IProblemDetailGetRequestQuery,
    IProblemDetailGetResponse,
    IProblemDetailPatchRequestBody,
    IProblemDetailPostRequestBody,
    IProblemDetailPostResponse,
    IProblemFileListGetResponse,
    IProblemFileUploadFinishPostRequestBody,
    IProblemFileUploadRequestPostRequestBody,
    IProblemListGetRequestQuery,
    IProblemListGetResponse,
} from "./problem.types";

export async function getProblemListAsync(query: IProblemListGetRequestQuery) {
    return await requestAsync<IProblemListGetResponse>({
        path: "problem/list",
        method: "GET",
        query: {
            ...query,
            tagIds: query.tagIds?.join(","),
        },
    });
}

export async function getProblemDetailAsync(displayId: string, query: IProblemDetailGetRequestQuery) {
    return await requestAsync<IProblemDetailGetResponse>({
        path: `problem/detail/${displayId}`,
        method: "GET",
        query: {
            ...query,
        },
    });
}

export async function postProblemDetailAsync(body: IProblemDetailPostRequestBody, recaptchaAsync: IRecaptchaAsync) {
    return await requestAsync<IProblemDetailPostResponse>({
        path: "problem/detail",
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemDetailPost),
    });
}

export async function patchProblemDetailAsync(
    id: number,
    body: IProblemDetailPatchRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync<void>({
        path: `problem/detail/${id}`,
        method: "PATCH",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemDetailPatch),
    });
}

export async function patchProblemContentDetailAsync(
    id: number,
    body: IProblemContentDetailPatchRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync<void>({
        path: `problem/detail/${id}/content`,
        method: "PATCH",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemContentDetailPatch),
    });
}

export async function getProblemFileListAsync(displayId: string, type?: CE_ProblemFileType) {
    return await requestAsync<IProblemFileListGetResponse>({
        path: `problem/detail/${displayId}/files`,
        method: "GET",
        query: { type },
    });
}

export async function postProblemFileUploadRequestAsync(
    id: string,
    body: IProblemFileUploadRequestPostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync<ISignedUploadRequest>({
        path: `problem/detail/${id}/file-upload-request`,
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemFileUpload),
    });
}

export async function postProblemFileUploadFinishAsync(
    id: string,
    body: IProblemFileUploadFinishPostRequestBody,
    recaptchaAsync: IRecaptchaAsync,
) {
    return await requestAsync<void>({
        path: `problem/detail/${id}/file-upload-finish`,
        method: "POST",
        body,
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemFileUpload),
    });
}

export async function getProblemAvailableDisplayIdAsync(recaptchaAsync: IRecaptchaAsync) {
    return await requestAsync<number>({
        path: "problem/available-display-id",
        method: "GET",
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemAvailableDisplayIdGet),
        noCache: true,
    });
}
