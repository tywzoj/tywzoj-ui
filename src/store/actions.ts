import { createAction } from "@reduxjs/toolkit";

import { setApiToken } from "@/common/utils/token";
import type { IUserDetail } from "@/server/modules/user.types";

import type { IAuthState, IEnvState, IFeatureState, IPaginationState, IPermissionState } from "./types";
import { createAppAction } from "./utils";

export const setEnvAction = createAction("Env/Set", (props: Partial<IEnvState>) => ({ payload: props }));
export const setPermissionAction = createAction("Permission/Set", (props: IPermissionState) => ({ payload: props }));
export const setPaginationAction = createAction("Pagination/Set", (props: IPaginationState) => ({ payload: props }));
export const setFeatureAction = createAction("Feature/Set", (props: IFeatureState) => ({ payload: props }));

export const setAuthAction = createAction("Auth/Set", (props: Partial<IAuthState>) => ({ payload: props }));

export const signInAction = createAppAction((token: string, user: IUserDetail) => (dispatch) => {
    setApiToken(token);
    dispatch(setAuthAction({ token, user }));
});
