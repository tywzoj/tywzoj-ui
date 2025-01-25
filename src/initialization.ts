import {
    registerMiddleScreenListener,
    registerMiniScreenListener,
    registerSmallScreenListener,
} from "./common/utils/window-width";
import { updateLocaleAsyncAction } from "./locales/actions";
import { AuthModule } from "./server/api";
import { CE_ErrorCode } from "./server/common/error-code";
import { setAuthAction, setEnvAction, setPermissionAction } from "./store/actions";
import type { IAppDispatch } from "./store/types";
import { createAppAction } from "./store/utils";
import { updateThemeAction } from "./theme/actions";

export const initWindowSizeListenerAction = createAppAction(() => (dispatch) => {
    registerMiniScreenListener((isMiniScreen) => dispatch(setEnvAction({ isMiniScreen })));
    registerSmallScreenListener((isSmallScreen) => dispatch(setEnvAction({ isSmallScreen })));
    registerMiddleScreenListener((isMiddleScreen) => dispatch(setEnvAction({ isMiddleScreen })));
});

export const initAsyncAction = createAppAction(() => async (dispatch: IAppDispatch) => {
    dispatch(initWindowSizeListenerAction());
    const { code, message, data } = await AuthModule.getSessionInfoAsync();
    if (code === CE_ErrorCode.OK) {
        dispatch(setAuthAction({ user: data.userDetail }));
        dispatch(setPermissionAction(data.permission));
        dispatch(updateThemeAction(data.userPreferenceDetail?.preferTheme || null));
        await dispatch(updateLocaleAsyncAction(data.userPreferenceDetail?.preferLanguage || null));
    } else {
        throw new Error(message);
    }
});
