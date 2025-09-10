import { CE_ErrorCode } from "@/server/common/error-code";

import { getCurrentPageUrlPath } from "../utils/url";
import { AppError } from "./app-error";

export class SignInRequiredError extends AppError {
    constructor() {
        super(
            CE_ErrorCode.SignInRequired,
            [
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
            ] /* links */,
        );
        this.name = "SignInRequiredError";
    }
}
