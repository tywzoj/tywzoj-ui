import type { PositioningImperativeRef } from "@fluentui/react-components";
import { Body1Strong, Button, makeStyles, Popover, PopoverSurface, PopoverTrigger } from "@fluentui/react-components";
import type React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";

import { flex } from "../styles/flex";

export interface IConfirmationPopoverProps {
    open: boolean;
    message: string;
    confirmText?: string;
    cancelText?: string;
    positioningRef: React.Ref<PositioningImperativeRef>;
    onConfirmed?: () => void;
    onCanceled?: () => void;
}

export const ConfirmationPopover: React.FC<IConfirmationPopoverProps> = (props) => {
    const { message, confirmText, cancelText, open, positioningRef, onCanceled, onConfirmed } = props;

    const styles = useStyles();

    const ls = useLocalizedStrings({
        confirm: CE_Strings.COMMON_CONFIRM_BUTTON,
        cancel: CE_Strings.COMMON_CANCEL_BUTTON,
    });

    return (
        <Popover
            withArrow
            positioning={{ positioningRef }}
            open={open}
            onOpenChange={(_, { open }) => {
                if (!open) {
                    onCanceled?.();
                }
            }}
        >
            <PopoverSurface>
                <div className={styles.message}>
                    <Body1Strong>{message}</Body1Strong>
                </div>

                <div className={styles.actions}>
                    <Button
                        appearance="primary"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onConfirmed?.();
                        }}
                    >
                        {confirmText ?? ls.confirm}
                    </Button>
                    <PopoverTrigger>
                        <Button>{cancelText ?? ls.cancel}</Button>
                    </PopoverTrigger>
                </div>
            </PopoverSurface>
        </Popover>
    );
};

const useStyles = makeStyles({
    message: {
        marginBottom: "16px",
    },
    actions: {
        width: "100%",
        ...flex({
            justifyContent: "flex-end",
        }),
        gap: "8px",
    },
});
