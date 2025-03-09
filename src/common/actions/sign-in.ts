import { updateLocaleAsyncAction } from "@/locales/actions";
import { setPermissionAction } from "@/permission/common/actions";
import type { AuthTypes } from "@/server/types";
import { setAuthAction } from "@/store/actions";
import { createAppAction } from "@/store/utils";
import { updateThemeAction } from "@/theme/actions";

import { queryClient } from "../../query/client";
import { setApiToken } from "../utils/token";

export const signInAsyncAction = createAppAction((respData: AuthTypes.ISignInPostResponse) => async (dispatch) => {
    queryClient.clear();
    setApiToken(respData.token);
    dispatch(setAuthAction({ token: respData.token, user: respData.userDetail }));
    dispatch(setPermissionAction(respData.permission));
    dispatch(updateThemeAction(respData?.userPreferenceDetail?.preferTheme));
    await dispatch(updateLocaleAsyncAction(respData?.userPreferenceDetail?.preferLanguage));
});

export const signOutAsyncAction = createAppAction((respData: AuthTypes.ISignOutPostResponse) => async (dispatch) => {
    setApiToken("");
    dispatch(setAuthAction({ token: null, user: null }));
    dispatch(setPermissionAction(respData.permission));
    dispatch(updateThemeAction(null));
    await dispatch(updateLocaleAsyncAction(null));
    queryClient.clear();
});
