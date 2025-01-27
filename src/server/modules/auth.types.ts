import type { IClientConfig } from "./config.types";
import type { IPermission } from "./permission.types";
import type { IUserDetail, IUserPreferenceDetail } from "./user.types";

export interface ISessionInfoGetResponse {
    readonly userDetail: IUserDetail | null;
    readonly userPreferenceDetail: IUserPreferenceDetail | null;
    readonly clientConfig: IClientConfig;
    readonly permission: IPermission;
}

export interface ISignInPostRequestBody {
    readonly usernameOrEmail: string;
    readonly password: string;
}

export interface ISignInPostResponse {
    readonly token: string;
    readonly userDetail: IUserDetail;
    readonly userPreferenceDetail: IUserPreferenceDetail;
    readonly permission: IPermission;
}

export interface ISignOutPostResponse {
    readonly permission: IPermission;
}
