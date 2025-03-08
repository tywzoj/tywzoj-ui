import { createAction } from "@reduxjs/toolkit";

import type { IPermissionState } from "@/store/types";

export const setPermissionAction = createAction("Permission/Set", (props: IPermissionState) => ({ payload: props }));
