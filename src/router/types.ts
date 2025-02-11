import type { QueryClient } from "@tanstack/react-query";

import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";
import type { UserTypes } from "@/server/types";
import type { IAppStore, IPermissionState } from "@/store/types";

export interface IRouterContext {
    queryClient: QueryClient;
    store: IAppStore;
    recaptchaAsync: IRecaptchaAsync;
    permission: IPermissionState;
    currentUser: UserTypes.IUserDetail | null;
}
