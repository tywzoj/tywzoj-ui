/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";

import { useErrorCodeToString } from "@/locales/hooks";

import { AppError } from "../exceptions/app-error";
import { useDispatchToastError } from "./toast";

/**
 * Catch errors and display a toast message.
 * @param fn A function that returns a promise that may throw an error.
 * @param throwErrors If true, the error will be thrown after displaying a toast message.
 * @param onSucceed A function that will be called if the promise is resolved. The errors thrown in this function will also be caught.
 * @returns A function that catches errors and displays a toast message, if throwErrors is false, you can't use the return value.
 */
export function useWithCatchError<P extends any[], R>(
    fn: (...args: P) => Promise<R>,
    throwErrors?: false,
    onSucceed?: (result: R) => void,
): (...args: P) => Promise<void>;
export function useWithCatchError<P extends any[], R>(
    fn: (...args: P) => Promise<R>,
    throwErrors: true,
): (...args: P) => Promise<R>;
export function useWithCatchError(
    fn: (...args: any[]) => Promise<any>,
    throwErrors = false,
    onSucceed?: (result: any) => void,
) {
    const errorToString = useErrorCodeToString();
    const dispatchError = useDispatchToastError();

    return React.useCallback(
        async (...args: any[]): Promise<any> => {
            try {
                const resp = await fn(...args);
                onSucceed?.(resp);
                return resp;
            } catch (error) {
                if (error instanceof AppError) {
                    dispatchError(errorToString(error.code));
                } else if (error instanceof Error) {
                    dispatchError(error.message);
                } else {
                    dispatchError(String(error));
                }

                if (throwErrors) {
                    throw error;
                } else {
                    console.error(error);
                }
            }
        },
        [fn, onSucceed, throwErrors, dispatchError, errorToString],
    );
}
