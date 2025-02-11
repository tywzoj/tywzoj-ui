import { CE_Strings } from "@/locales/locale";
import { CE_ErrorCode } from "@/server/common/error-code";

import type { IStringCodeErrorLink } from "../types/error-link";
import { getCurrentPageUrlPath } from "../utils/url";
import { AppError } from "./app-error";

export class SignInRequiredError extends AppError {
    constructor() {
        super(CE_ErrorCode.SignInRequired);
    }

    public getLinks(): IStringCodeErrorLink[] {
        return [
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
        ];
    }
}
