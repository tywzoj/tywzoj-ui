import type { IClientConfig } from "./config.types";
import type { IPermission } from "./permission.types";
import type { IUserDetail, IUserPreferenceDetail } from "./user.types";

export interface ISessionInfoGetResponse {
    readonly userDetail: IUserDetail | null;
    readonly userPreferenceDetail: IUserPreferenceDetail | null;
    readonly clientConfig: IClientConfig;
    readonly permission: IPermission;
}
