import { AuthModule } from "./server/api";
import { CE_ErrorCode } from "./server/common/error-code";
import { setEnvAction, setPermissionAction } from "./store/actions";
import type { IAppDispatch } from "./store/types";
import { createAppAction } from "./store/utils";
import { updateThemeAction } from "./theme/actions";
import {
    registerMiddleScreenListener,
    registerMiniScreenListener,
    registerSmallScreenListener,
} from "./utils/window-width";

export const initWindowSizeListenerAction = createAppAction(() => (dispatch) => {
    registerMiniScreenListener((isMiniScreen) => dispatch(setEnvAction({ isMiniScreen })));
    registerSmallScreenListener((isSmallScreen) => dispatch(setEnvAction({ isSmallScreen })));
    registerMiddleScreenListener((isMiddleScreen) => dispatch(setEnvAction({ isMiddleScreen })));
});

export const initAsyncAction = createAppAction(() => async (dispatch: IAppDispatch) => {
    dispatch(initWindowSizeListenerAction());
    const { code, message, data } = await AuthModule.getSessionInfoAsync();
    if (code === CE_ErrorCode.OK) {
        dispatch(setPermissionAction(data.permission));
        if (data.userPreferenceDetail) {
            dispatch(updateThemeAction(data.userPreferenceDetail.preferTheme));
        }
    } else {
        throw new Error(message);
    }
});
