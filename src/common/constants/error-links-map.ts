import { CE_Strings } from "@/locales/types";
import { CE_ErrorCode } from "@/server/common/error-code";

import type { IStringCodeErrorLink } from "../types/error-link";

type IErrorStringMap = {
    [key in CE_ErrorCode]?: IStringCodeErrorLink[];
};

export const ERROR_LINKS_MAP: IErrorStringMap = {
    [CE_ErrorCode.SignInRequired]: [
        {
            string: CE_Strings.NAVIGATION_SIGN_IN,
            to: "/sign-in",
        },
        {
            string: CE_Strings.NAVIGATION_SIGN_UP,
            to: "/sign-up",
        },
    ],
};
