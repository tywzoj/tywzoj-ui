import type { ILocaleState } from "@/locales/types";
import type { IUserDetail } from "@/server/modules/user.types";
import type { ConfigTypes, PermissionTypes } from "@/server/types";
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
    isMobile: boolean;

    isMiddleScreen: boolean;
    isSmallScreen: boolean;
    isMiniScreen: boolean;
}

export interface IAuthState {
    user: IUserDetail | null;
    token: string | null;
}

export type IPermissionState = PermissionTypes.IPermission;
export type IPaginationState = ConfigTypes.IPagination;

export interface IRootState {
    env: IEnvState;
    theme: CE_Theme;
    locale: ILocaleState;
    auth: IAuthState;
    apiEndPoint: string;
    permission: IPermissionState;
    pagination: IPaginationState;
}
