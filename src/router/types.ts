import type { QueryClient } from "@tanstack/react-query";

import type { IRecaptchaAsync } from "@/common/hooks/recaptcha";
import type { IAppStore } from "@/store/types";

export interface IRouterContext {
    queryClient: QueryClient;
    store: IAppStore;
    recaptchaAsync: IRecaptchaAsync;
}
