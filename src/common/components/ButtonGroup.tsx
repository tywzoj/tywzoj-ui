import { makeStyles, mergeClasses, tokens } from "@fluentui/react-components";
import type React from "react";

import { flex } from "@/common/styles/flex";

export interface IButtonGroupProps {
    className?: string;
    vertical?: boolean;
}

export const ButtonGroup: React.FC<React.PropsWithChildren<IButtonGroupProps>> = (props) => {
    const { vertical, children } = props;

    const styles = useStyles();

    return (
        <div className={mergeClasses(vertical ? styles.$rootVertical : styles.$rootHorizontal, props.className)}>
            {children}
        </div>
    );
};

export const firstButtonClassName = "button-group-first";
export const lastButtonClassName = "button-group-last";

const useStyles = makeStyles({
    $rootHorizontal: {
        "&, & div": flex(),
        "& .fui-Button": {
            minWidth: "fit-content",
        },
        "& .fui-Button.button-group-first": {
            borderRadius: "unset",
            borderTopLeftRadius: tokens.borderRadiusLarge,
            borderBottomLeftRadius: tokens.borderRadiusLarge,
        },
        "& .fui-Button:not(.button-group-first)": {
            borderLeft: "0",
        },
        "& .fui-Button:not(.button-group-first):not(.button-group-last)": {
            borderRadius: "0",
        },
        "& .fui-Button.button-group-last": {
            borderRadius: "unset",
            borderTopRightRadius: tokens.borderRadiusLarge,
            borderBottomRightRadius: tokens.borderRadiusLarge,
        },
    },
    $rootVertical: {
        "&, & div": flex({
            flexDirection: "column",
        }),
        "& .fui-Button.button-group-first": {
            borderRadius: "unset",
            borderTopLeftRadius: tokens.borderRadiusLarge,
            borderTopRightRadius: tokens.borderRadiusLarge,
        },
        "& .fui-Button:not(.button-group-first)": {
            borderTop: "0",
        },
        "& .fui-Button:not(.button-group-first):not(.button-group-last)": {
            borderRadius: "0",
        },
        "& .fui-Button.button-group-last": {
            borderRadius: "unset",
            borderBottomLeftRadius: tokens.borderRadiusLarge,
            borderBottomRightRadius: tokens.borderRadiusLarge,
        },
    },
});
