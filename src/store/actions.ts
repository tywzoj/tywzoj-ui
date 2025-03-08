import { createAction } from "@reduxjs/toolkit";

import type { IAuthState, IEnvState, IFeatureState, IPaginationState, IPreferenceState } from "./types";

export const setPageTitleAction = createAction("PageTitle/Set", (props: string) => ({ payload: props }));
export const setEnvAction = createAction("Env/Set", (props: Partial<IEnvState>) => ({ payload: props }));
export const setPaginationAction = createAction("Pagination/Set", (props: IPaginationState) => ({ payload: props }));
export const setFeatureAction = createAction("Feature/Set", (props: IFeatureState) => ({ payload: props }));
export const setAuthAction = createAction("Auth/Set", (props: Partial<IAuthState>) => ({ payload: props }));
export const setPreferenceAction = createAction("Preference/Set", (props: Partial<IPreferenceState>) => ({
    payload: props,
}));
