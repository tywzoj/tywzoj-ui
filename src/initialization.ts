import {
    registerMiddleScreenListener,
    registerMiniScreenListener,
    registerSmallScreenListener,
} from "./common/utils/window-width";
import { updateLocaleAsyncAction } from "./locales/actions";
import { AuthModule } from "./server/api";
import { CE_ErrorCode } from "./server/common/error-code";
import {
    setAuthAction,
    setEnvAction,
    setFeatureAction,
    setPaginationAction,
    setPermissionAction,
} from "./store/actions";
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
    const resp = await AuthModule.getSessionInfoAsync();
    if (resp.code === CE_ErrorCode.OK) {
        dispatch(setFeatureAction(resp.data.clientConfig.feature));
        dispatch(setPaginationAction(resp.data.clientConfig.pagination));
        dispatch(setPermissionAction(resp.data.permission));
        dispatch(setAuthAction({ user: resp.data.userDetail }));
        dispatch(updateThemeAction(resp.data.userPreferenceDetail?.preferTheme || null));
        await dispatch(updateLocaleAsyncAction(resp.data.userPreferenceDetail?.preferLanguage || null));
    } else {
        if (resp.data instanceof Error) {
            throw resp.data;
        } else {
            throw new Error(resp.message);
        }
    }
});
