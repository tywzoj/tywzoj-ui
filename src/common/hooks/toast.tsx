import { Toast, ToastBody, ToastTitle, useToastController } from "@fluentui/react-components";
import * as React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

import { ToastContext } from "../providers/ToastProvider.ctx";

export const useToast = () => useToastController(React.useContext(ToastContext));

export const useDispatchToastError = () => {
    const { dispatchToast } = useToast();
    const [title] = useLocalizedStrings(CE_Strings.COMMON_ERROR_TITLE);

    return React.useCallback(
        (message: string) => {
            dispatchToast(
                <Toast>
                    <ToastTitle>{title}</ToastTitle>
                    <ToastBody>{message}</ToastBody>
                </Toast>,
                {
                    position: "top-end",
                    intent: "error",
                },
            );
        },
        [dispatchToast, title],
    );
};
