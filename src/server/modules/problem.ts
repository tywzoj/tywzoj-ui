import { CE_RecaptchaAction } from "@/common/enums/recaptcha-action";
import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";

import { requestAsync } from "../request";
import type {
    IProblemDetailGetRequestQuery,
    IProblemDetailGetResponse,
    IProblemDetailPostRequestBody,
    IProblemDetailPostResponse,
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

export async function getProblemAvailableDisplayIdAsync(recaptchaAsync: IRecaptchaAsync) {
    return await requestAsync<number>({
        path: "problem/available-display-id",
        method: "GET",
        recaptchaToken: await recaptchaAsync(CE_RecaptchaAction.ProblemDetailPost),
        noCache: true,
    });
}
