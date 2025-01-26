import { Toaster, useId } from "@fluentui/react-components";
import type * as React from "react";

import { useIsMiddleScreen, useIsMiniScreen } from "@/store/hooks";

import { ToastContext } from "./ToastProvider.ctx";

export interface IToastProviderProps {
    children: React.ReactElement;
}

export const ToastProvider: React.FC<IToastProviderProps> = ({ children }) => {
    const id = useId("toaster");

    const isMiddleScreen = useIsMiddleScreen();
    const isMiniScreen = useIsMiniScreen();

    return (
        <ToastContext.Provider value={id}>
            {children}
            <Toaster
                toasterId={id}
                offset={{
                    vertical: 50,
                    horizontal: isMiniScreen ? 10 : isMiddleScreen ? 20 : 40,
                }}
            />
        </ToastContext.Provider>
    );
};
