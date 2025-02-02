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

export async function postProblemDetailAsync(body: IProblemDetailPostRequestBody) {
    return await requestAsync<IProblemDetailPostResponse>({
        path: "problem/detail",
        method: "POST",
        body,
    });
}
