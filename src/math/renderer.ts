import "katex/dist/katex.min.css";

import { v4 as uuid4 } from "uuid";

import MathWorker from "./math.worker?worker";
import type { IMathRenderResultEventData, IMathRenderTaskEventData } from "./types";

export class MathRenderer {
    private static instance: MathRenderer;
    private worker: Worker;
    private callbacks: Map<
        string,
        {
            resolve: (result: string) => void;
            reject: (error: unknown) => void;
        }
    > = new Map();

    private constructor() {
        this.worker = new MathWorker();

        this.worker.onmessage = (event: MessageEvent<IMathRenderResultEventData>) => {
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

    public static getInstance(): MathRenderer {
        if (!this.instance) {
            this.instance = new MathRenderer();
        }
        return this.instance;
    }

    public render(math: string, displayMode: boolean): Promise<string> {
        return new Promise((resolve, reject) => {
            const id = uuid4();
            this.callbacks.set(id, {
                resolve,
                reject,
            });
            const msg: IMathRenderTaskEventData = {
                id,
                math,
                displayMode,
            };
            this.worker.postMessage(msg);
        });
    }
}
