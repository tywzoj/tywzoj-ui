import React from "react";

interface IDialogAwaiter {
    readonly opened: boolean;
    /**
     * Opens the dialog and returns a promise that resolves to true if the dialog is confirmed, false if the dialog is aborted.
     * @returns {Promise<boolean>} A promise that resolves to true if onConfirm is called, false if onAbort is called.
     */
    readonly confirmAsync: () => Promise<boolean>;
    /**
     * @param closeDialog If false, the dialog will not be closed after calling this function. Default is true.
     */
    readonly onConfirm: (closeDialog?: boolean) => void;
    readonly onAbort: () => void;
    readonly closeDialog: () => void;
}

export const useDialogAwaiter = (): IDialogAwaiter => {
    const resolveFn = React.useRef<(value: boolean) => void>();
    const [opened, setOpened] = React.useState(false);

    React.useEffect(() => {
        return () => {
            resolveFn.current?.(false);
        };
    }, []);

    return {
        opened,
        confirmAsync: () => {
            return new Promise<boolean>((resolve) => {
                resolveFn.current = resolve;
                setOpened(true);
            });
        },
        onConfirm: (closeDialog = true) => {
            resolveFn.current?.(true);
            if (closeDialog) {
                setOpened(false);
            }
        },
        onAbort: () => {
            resolveFn.current?.(false);
            setOpened(false);
        },
        closeDialog: () => {
            setOpened(false);
        },
    };
};
