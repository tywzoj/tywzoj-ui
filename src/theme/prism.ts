import { CE_Theme } from "./types";

const cssUrlOneLightHref = new URL("../assets/themes/prism-one-light.css", import.meta.url).href;
const cssUrlDraculaHref = new URL("../assets/themes/prism-dracula.css", import.meta.url).href;

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
    }
}
