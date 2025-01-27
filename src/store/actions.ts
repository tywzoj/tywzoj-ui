import { createAction } from "@reduxjs/toolkit";

import type { IAuthState, IEnvState, IFeatureState, IPaginationState, IPermissionState } from "./types";

export const setPageTitleAction = createAction("PageTitle/Set", (props: string) => ({ payload: props }));
export const setEnvAction = createAction("Env/Set", (props: Partial<IEnvState>) => ({ payload: props }));
export const setPermissionAction = createAction("Permission/Set", (props: IPermissionState) => ({ payload: props }));
export const setPaginationAction = createAction("Pagination/Set", (props: IPaginationState) => ({ payload: props }));
export const setFeatureAction = createAction("Feature/Set", (props: IFeatureState) => ({ payload: props }));
export const setAuthAction = createAction("Auth/Set", (props: Partial<IAuthState>) => ({ payload: props }));
