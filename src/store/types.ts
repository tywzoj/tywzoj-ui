import type { PermissionTypes } from "@/server/types";
import type { CE_Theme } from "@/theme/types";

import type { store } from "./store";

export type IAppStore = typeof store;
export type IAppDispatch = typeof store.dispatch;

export interface IEnvState {
    isChrome: boolean;
    isEdge: boolean;
    isFirefox: boolean;
    isSafari: boolean;

    isAndroid: boolean;
    isIOS: boolean;

    isMiddleScreen: boolean;
    isSmallScreen: boolean;
    isMiniScreen: boolean;

    isMobile: boolean;
    isMobileView: boolean;
}

export interface IAuthState {
    user: unknown | null;
    token: string | null;
    apiEndPoint: string;
}

export type IPermissionState = PermissionTypes.IPermission;

export interface IRootState {
    env: IEnvState;
    theme: CE_Theme;
    auth: IAuthState;
    permission: IPermissionState;
}
