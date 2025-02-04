import cssUrlDraculaHref from "@/assets/styles/prism-dracula.css?url";
import cssUrlOneLightHref from "@/assets/styles/prism-one-light.css?url";
import { neverGuard } from "@/common/utils/never-guard";

import { CE_Theme } from "./types";

const cssLinkTag = document.createElement("link");
cssLinkTag.rel = "stylesheet";
document.head.appendChild(cssLinkTag);

export function injectPrismTheme(theme: CE_Theme) {
    switch (theme) {
        case CE_Theme.Light:
            cssLinkTag.href = cssUrlOneLightHref;
            break;
        case CE_Theme.Dark:
            cssLinkTag.href = cssUrlDraculaHref;
            break;
        default:
            neverGuard(theme);
    }
}
