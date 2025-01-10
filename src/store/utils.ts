import { useAppSelector } from "./store";
import type { IAppDispatch, IRootState } from "./types";

export const createAppAction = <R, P extends unknown[]>(
    action: (...args: P) => (dispatch: IAppDispatch, getState: () => IRootState) => R,
) => action;

export const createAppSelector = <R>(selector: (state: IRootState) => R) => selector;

export const createAppStoreHook =
    <R>(selector: (state: IRootState) => R) =>
    () =>
        useAppSelector(selector);
