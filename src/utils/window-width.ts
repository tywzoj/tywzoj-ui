const MAX_MINI_SCREEN_WIDTH = 425;
const MAX_SMALL_SCREEN_WIDTH = 480;
const MAX_MIDDLE_SCREEN_WIDTH = 960;

export const miniScreenMediaQuery = window.matchMedia(`(max-width: ${MAX_MINI_SCREEN_WIDTH}px)`);
export const smallScreenMediaQuery = window.matchMedia(`(max-width: ${MAX_SMALL_SCREEN_WIDTH}px)`);
export const middleScreenMediaQuery = window.matchMedia(`(max-width: ${MAX_MIDDLE_SCREEN_WIDTH}px)`);

export function registerMiniScreenListener(listener: (isMiniScreen: boolean) => void): void {
    miniScreenMediaQuery.addEventListener("change", (e) => listener(e.matches));
}

export function registerSmallScreenListener(listener: (isSmallScreen: boolean) => void): void {
    smallScreenMediaQuery.addEventListener("change", (e) => listener(e.matches));
}

export function registerMiddleScreenListener(listener: (isMiddleScreen: boolean) => void): void {
    middleScreenMediaQuery.addEventListener("change", (e) => listener(e.matches));
}

export function isMiniScreen(): boolean {
    return miniScreenMediaQuery.matches;
}

export function isSmallScreen(): boolean {
    return smallScreenMediaQuery.matches;
}

export function isMiddleScreen(): boolean {
    return middleScreenMediaQuery.matches;
}
