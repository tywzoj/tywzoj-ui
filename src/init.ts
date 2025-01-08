import { AuthModule } from "./server/api";
import { CE_ErrorCode } from "./server/common/error-code";
import { setEnvAction, setPermissionAction } from "./store/actions";
import type { IAppDispatch } from "./store/types";
import { initThemeAction, updateThemeAction } from "./theme";
import { isMiddleScreen, isMiniScreen, isMobileView, isSmallScreen } from "./utils/user-agent";

export const initWindowSizeListenerAction = () => (dispatch: IAppDispatch) => {
    window.addEventListener("resize", () =>
        dispatch(
            setEnvAction({
                isMiniScreen: isMiniScreen(),
                isSmallScreen: isSmallScreen(),
                isMiddleScreen: isMiddleScreen(),
                isMobileView: isMobileView(),
            }),
        ),
    );
};

export const initSessionInfoAsyncAction = () => async (dispatch: IAppDispatch) => {
    const { code, data } = await AuthModule.getSessionInfoAsync();
    if (code === CE_ErrorCode.OK) {
        dispatch(setPermissionAction(data.permission));
        if (data.userPreferenceDetail) {
            if (data.userPreferenceDetail.preferTheme) {
                dispatch(updateThemeAction(data.userPreferenceDetail.preferTheme));
            }
        }
    }
};

export const initAction = () => (dispatch: IAppDispatch) => {
    dispatch(initWindowSizeListenerAction());
    dispatch(initThemeAction());
};
