/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ArrayValues, TupleToUnion } from "type-fest";

import { ERROR_LINKS_MAP } from "@/common/constants/error-links-map";
import { AppError } from "@/common/exceptions/app-error";

import { CE_ErrorCode } from "./common/error-code";
import type { IResponseBody } from "./request";

type IError = Exclude<CE_ErrorCode, CE_ErrorCode.OK>;
type IResponseBodyAfterThrow<T, E extends IError[]> = IResponseBody<T, ArrayValues<E>>;
type IRequestAsyncFn<T, P extends any[]> = (...args: P) => Promise<IResponseBody<T>>;
type IRequestAsyncFnWithThrow<T, P extends any[], E extends IError[]> = (
    ...args: P
) => Promise<IResponseBodyAfterThrow<T, E>>;

export type IErrorCodeWillBeReturned<F> =
    F extends IRequestAsyncFnWithThrow<any, any, infer E> ? TupleToUnion<E> : never;

export function withThrowErrorsExcept<T, P extends any[], E extends IError[]>(
    fn: IRequestAsyncFn<T, P>,
    ...except: E
): IRequestAsyncFnWithThrow<T, P, E> {
    return async (...args) => {
        const res = await fn(...args);
        if (res.code === CE_ErrorCode.OK || except.includes(res.code)) {
            return res as IResponseBodyAfterThrow<T, E>;
        } else {
            const links = ERROR_LINKS_MAP[res.code];
            throw new AppError(
                res.code,
                typeof links === "function" ? links() : links,
                true /* showGoBack */,
                res.data ? String(res.data) : undefined,
            );
        }
    };
}

export function withThrowErrors<T, P extends any[]>(fn: IRequestAsyncFn<T, P>) {
    return withThrowErrorsExcept(fn);
}
