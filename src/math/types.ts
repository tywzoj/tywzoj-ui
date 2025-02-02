export interface IMathRenderTaskEventData {
    readonly id: string;
    readonly math: string;
    readonly displayMode: boolean;
}

export type IMathRenderResultEventData = { readonly id: string } & (
    | { readonly success: true; readonly result: string }
    | { readonly success: false; readonly error: unknown }
);
