import type { IAppDispatch, IRootState } from "./types";

export function createAppAction<R, P extends unknown[]>(
    action: (...args: P) => (dispatch: IAppDispatch, getState: () => IRootState) => R,
) {
    return action;
}

export function createAppSelector<R>(selector: (state: IRootState) => R) {
    return selector;
}
