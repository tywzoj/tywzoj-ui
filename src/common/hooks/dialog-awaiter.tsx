import React from "react";

interface IDialogAwaiter {
    readonly opened: boolean;
    /**
     * Opens the dialog and returns a promise that resolves to true if the dialog is confirmed, false if the dialog is aborted.
     * @returns {Promise<boolean>} A promise that resolves to true if onConfirm is called, false if onAbort is called.
     */
    readonly confirmAsync: () => Promise<boolean>;
    readonly onConfirm: () => void;
    readonly onAbort: () => void;
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
        onConfirm: () => {
            resolveFn.current?.(true);
            setOpened(false);
        },
        onAbort: () => {
            resolveFn.current?.(false);
            setOpened(false);
        },
    };
};
