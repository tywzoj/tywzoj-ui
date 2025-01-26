import { store } from "@/store/store";

import { CE_ErrorCode } from "./common/error-code";

export interface IRequestOptions {
    path: string;
    method: "GET" | "POST" | "PATCH" | "DELETE";
    query?: Record<string, string>;
    body?: object | string;
    recaptchaToken?: string;
}

export type IResponseBody<T> =
    | {
          code: Exclude<CE_ErrorCode, CE_ErrorCode.OK>;
          message: string;
          data: unknown;
      }
    | {
          code: CE_ErrorCode.OK;
          message: string;
          data: T;
      };

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
        for (const key in options.query) {
            if (Object.prototype.hasOwnProperty.call(options.query, key)) {
                url.searchParams.append(key, options.query[key]);
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
