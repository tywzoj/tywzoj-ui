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
