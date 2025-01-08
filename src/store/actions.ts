import { createAction } from "@reduxjs/toolkit";

import type { CE_Theme } from "@/theme/types";

import type { IEnvState, IPermissionState } from "./types";

export const setEnvAction = createAction("Env/Set", (props: Partial<IEnvState>) => ({ payload: props }));
export const setThemeAction = createAction("Theme/Set", (theme: CE_Theme) => ({ payload: theme }));
export const setPermissionAction = createAction("Permission/Set", (props: IPermissionState) => ({ payload: props }));
