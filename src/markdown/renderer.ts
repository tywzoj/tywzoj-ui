import { v4 as uuid4 } from "uuid";

import MarkdownWorker from "./markdown.worker?worker";
import type { IMarkdownRenderResult, IMarkdownRenderResultEventData, IMarkdownRenderTaskEventData } from "./types";

export class MarkdownRenderer {
    private static instance: MarkdownRenderer;
    private worker: Worker;
    private callbacks: Map<
        string,
        {
            resolve: (result: IMarkdownRenderResult) => void;
            reject: (error: unknown) => void;
        }
    > = new Map();

    private constructor() {
        this.worker = new MarkdownWorker();

        this.worker.onmessage = (event: MessageEvent<IMarkdownRenderResultEventData>) => {
            const {
                data: { id, ...data },
            } = event;

            const callback = this.callbacks.get(id);
            if (!callback) return;

            if (data.success) {
                callback.resolve(data.result);
            } else {
                callback.reject(data.error);
            }

            this.callbacks.delete(id);
        };

        this.worker.onerror = (error) => {
            for (const callback of this.callbacks.values()) {
                callback.reject(error);
            }
            this.callbacks.clear();
        };
    }

    public static getInstance(): MarkdownRenderer {
        if (!this.instance) {
            this.instance = new MarkdownRenderer();
        }
        return this.instance;
    }

    public render(markdown: string): Promise<IMarkdownRenderResult> {
        return new Promise((resolve, reject) => {
            const id = uuid4();
            this.callbacks.set(id, {
                resolve,
                reject,
            });
            const msg: IMarkdownRenderTaskEventData = { id, markdown };
            this.worker.postMessage(msg);
        });
    }
}
