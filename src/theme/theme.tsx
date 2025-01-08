import "@/assets/themes/theme-pure.css";
import "@/assets/themes/theme-far.css";

import { CE_Theme } from "./types";

const themeMap: { [k in CE_Theme]: string } = {
    [CE_Theme.Light]: "pure",
    [CE_Theme.Dark]: "far",
};

export function setGlobalTheme(theme: CE_Theme) {
    document.body.setAttribute("data-theme", themeMap[theme]);
}
