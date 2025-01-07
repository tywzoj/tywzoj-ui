import type { store } from "./store";

export type IAppStore = typeof store;
export type IAppState = ReturnType<typeof store.getState>;
export type IAppDispatch = typeof store.dispatch;
