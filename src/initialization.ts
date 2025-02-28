import { refreshSessionInfoAsyncAction } from "./common/actions/session-info";
import {
    registerMiddleScreenListener,
    registerMiniScreenListener,
    registerSmallScreenListener,
} from "./common/utils/window-width";
import { setEnvAction } from "./store/actions";
import { getIsIOS, getIsSafari } from "./store/selectors";
import type { IAppDispatch } from "./store/types";
import { createAppAction } from "./store/utils";

const initWindowSizeListenerAction = createAppAction(() => (dispatch) => {
    registerMiniScreenListener((isMiniScreen) => dispatch(setEnvAction({ isMiniScreen })));
    registerSmallScreenListener((isSmallScreen) => dispatch(setEnvAction({ isSmallScreen })));
    registerMiddleScreenListener((isMiddleScreen) => dispatch(setEnvAction({ isMiddleScreen })));
});

const initIosScaleListenerAction = createAppAction(() => (_dispatch, getState) => {
    const isIos = getIsIOS(getState());
    const isSafari = getIsSafari(getState());
    if (isIos && isSafari) {
        document.addEventListener("gesturestart", (event) => {
            event.preventDefault();
        });
    }
});

export const initAsyncAction = createAppAction(() => async (dispatch: IAppDispatch) => {
    dispatch(initWindowSizeListenerAction());
    dispatch(initIosScaleListenerAction());
    await dispatch(refreshSessionInfoAsyncAction());
});
