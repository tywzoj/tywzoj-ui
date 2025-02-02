import katex from "katex";

import type { IMathRenderResultEventData, IMathRenderTaskEventData } from "./types";

export function renderMath(math: string, displayMode: boolean) {
    return katex.renderToString(math, {
        throwOnError: false,
        displayMode,
    });
}

self.onmessage = (event: MessageEvent<IMathRenderTaskEventData>) => {
    const { id, math, displayMode } = event.data;
    let msg: IMathRenderResultEventData;
    try {
        msg = {
            id,
            success: true,
            result: renderMath(math, displayMode),
        };
    } catch (error) {
        msg = { id, success: false, error };
    }
    self.postMessage(msg);
};
