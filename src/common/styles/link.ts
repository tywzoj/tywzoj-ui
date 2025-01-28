import { tokens } from "@fluentui/react-components";

export const commonLinkStyles = {
    color: tokens.colorBrandForegroundLink,
    textDecoration: "none",
    ":hover": {
        color: tokens.colorBrandForegroundLinkHover,
        textDecoration: `underline solid ${tokens.colorBrandForegroundLinkHover} ${tokens.strokeWidthThin}`,
    },
    ":active": {
        color: tokens.colorBrandForegroundLinkPressed,
    },
};

export const noUnderlineLinkStyles = {
    color: tokens.colorBrandForegroundLink,
    textDecoration: "none",
    ":hover": {
        color: tokens.colorBrandForegroundLinkHover,
        textDecoration: "none",
    },
    ":active": {
        color: tokens.colorBrandForegroundLinkPressed,
    },
};
