import type { CE_Strings } from "@/locales/types";
import { getStringIdFromErrorCode } from "@/locales/utils";
import type { CE_ErrorCode } from "@/server/common/error-code";

import type { IErrorLink } from "../types/error-link";

export class AppError extends Error {
    constructor(
        public readonly code: CE_ErrorCode,
        public readonly links: IErrorLink[] = [],
        public readonly showGoBack = false,
    ) {
        super("AppError");
    }

    public getStringId(): CE_Strings {
        return getStringIdFromErrorCode(this.code);
    }
}
