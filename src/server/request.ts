import { store } from "@/store/store";

import { CE_ErrorCode } from "./common/error-code";

export interface IRequestOptions {
    path: string;
    method: "GET" | "POST" | "PATCH" | "DELETE";
    query?: Record<string, string | number | boolean | undefined>;
    body?: object | string;
    recaptchaToken?: string;
}

type IError = Exclude<CE_ErrorCode, CE_ErrorCode.OK>;
type ISuccessResponseBody<T> = {
    code: CE_ErrorCode.OK;
    message: string;
    data: T;
};
type IErrorResponseBody<E extends IError> = {
    code: E;
    message: string;
    data: unknown;
};
export type IResponseBody<T, E extends IError = IError> =
    | (E extends never ? never : IErrorResponseBody<E>)
    | (T extends never ? never : ISuccessResponseBody<T>);

export async function requestAsync<T>(options: IRequestOptions): Promise<IResponseBody<T>> {
    const {
        auth: { token },
        apiEndPoint,
    } = store.getState();

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }
    if (options.recaptchaToken) {
        headers.append("X-Recaptcha-Token", options.recaptchaToken);
    }

    const url = new URL(`/api/${options.path}`, apiEndPoint);

    if (options.query) {
        const query = options.query as Record<string, unknown>;
        for (const key in query) {
            if (Object.prototype.hasOwnProperty.call(query, key) && query[key] !== undefined) {
                url.searchParams.append(key, String(query[key]));
            }
        }
    }

    const body: string | undefined = options.body
        ? typeof options.body === "string"
            ? options.body
            : JSON.stringify(options.body)
        : undefined;

    try {
        const response = await fetch(url, {
            method: options.method,
            body,
            headers,
        });

        return await response.json();
    } catch (error) {
        return {
            code: CE_ErrorCode.Unknown,
            message: "Network error.",
            data: error,
        };
    }
}
