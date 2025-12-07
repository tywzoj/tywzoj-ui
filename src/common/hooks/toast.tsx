import { Toast, ToastBody, ToastTitle, useToastController } from "@fluentui/react-components";
import * as React from "react";

import { useLocalizedStrings } from "@/locales/hooks";

import { ToastContext } from "../providers/ToastProvider.ctx";

export const useToast = () => useToastController(React.useContext(ToastContext));

export const useDispatchToastError = () => {
    const { dispatchToast } = useToast();
    const ls = useLocalizedStrings();

    return React.useCallback(
        (
            message: string,
            { customTitle, ...options }: Parameters<typeof dispatchToast>[1] & { customTitle?: string } = {},
        ) => {
            dispatchToast(
                <Toast>
                    <ToastTitle>{customTitle ?? ls.$COMMON_ERROR_TITLE}</ToastTitle>
                    <ToastBody>{message}</ToastBody>
                </Toast>,
                {
                    position: "top-end",
                    intent: "error",
                    ...options,
                },
            );
        },
        [dispatchToast, ls],
    );
};

export const useDispatchToastSuccess = () => {
    const { dispatchToast } = useToast();

    return React.useCallback(
        (title: string, message?: string, options?: Parameters<typeof dispatchToast>[1]) => {
            dispatchToast(
                <Toast>
                    <ToastTitle>{title}</ToastTitle>
                    {message && <ToastBody>{message}</ToastBody>}
                </Toast>,
                {
                    position: "top-end",
                    intent: "success",
                    ...options,
                },
            );
        },
        [dispatchToast],
    );
};
