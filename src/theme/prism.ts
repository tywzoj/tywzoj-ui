import { CE_Theme } from "./types";

const cssUrlTomorrowHref = new URL("@/assets/themes/prism-tomorrow.css", import.meta.url).href;
const cssUrlTomorrowNightHref = new URL("@/assets/themes/prism-tomorrow-night.css", import.meta.url).href;

const cssLinkTag = document.createElement("link");
cssLinkTag.rel = "stylesheet";
document.head.appendChild(cssLinkTag);

export function injectPrismTheme(theme: CE_Theme) {
    switch (theme) {
        case CE_Theme.Light:
            cssLinkTag.href = cssUrlTomorrowHref;
            break;
        case CE_Theme.Dark:
            cssLinkTag.href = cssUrlTomorrowNightHref;
            break;
    }
}
