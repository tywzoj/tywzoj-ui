import { CE_Strings } from "@/locales/locale";
import { CE_ErrorCode } from "@/server/common/error-code";

import type { IStringCodeErrorLink } from "../types/error-link";
import { getCurrentPageUrlPath } from "../utils/url";

type IErrorStringMap = {
    [key in CE_ErrorCode]?: IStringCodeErrorLink[] | (() => IStringCodeErrorLink[]);
};

export const ERROR_LINKS_MAP: IErrorStringMap = {
    [CE_ErrorCode.SignInRequired]: () => [
        {
            string: CE_Strings.NAVIGATION_SIGN_IN,
            to: "/sign-in",
            search: {
                redirect: getCurrentPageUrlPath(),
            },
        },
        {
            string: CE_Strings.NAVIGATION_SIGN_UP,
            to: "/sign-up",
            search: {
                redirect: getCurrentPageUrlPath(),
            },
        },
    ],
};
