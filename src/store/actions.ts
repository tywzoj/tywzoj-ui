import { createAction } from "@reduxjs/toolkit";

import type { IEnvState, IPaginationState, IPermissionState } from "./types";

export const setEnvAction = createAction("Env/Set", (props: Partial<IEnvState>) => ({ payload: props }));
export const setPermissionAction = createAction("Permission/Set", (props: IPermissionState) => ({ payload: props }));
export const setPaginationAction = createAction("Pagination/Set", (props: IPaginationState) => ({ payload: props }));
