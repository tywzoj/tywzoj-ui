import { CE_ErrorCode } from "@/server/common/error-code";

import type { ILocalizedStringFunctionErrorLink } from "../types/error-link";
import { getCurrentPageUrlPath } from "../utils/url";

type IErrorStringMap = {
    [key in CE_ErrorCode]?: ILocalizedStringFunctionErrorLink[] | (() => ILocalizedStringFunctionErrorLink[]);
};

export const ERROR_LINKS_MAP: IErrorStringMap = {
    [CE_ErrorCode.SignInRequired]: () => [
        {
            lsFn: (ls) => ls.$NAVIGATION_SIGN_IN,
            to: "/sign-in",
            search: {
                redirect: getCurrentPageUrlPath(),
            },
        },
        {
            lsFn: (ls) => ls.$NAVIGATION_SIGN_UP,
            to: "/sign-up",
            search: {
                redirect: getCurrentPageUrlPath(),
            },
        },
    ],
};
