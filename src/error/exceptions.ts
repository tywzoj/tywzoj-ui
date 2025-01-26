import type { IErrorPageLink } from "@/components/ErrorPage";
import type { CE_Strings } from "@/locales/types";
import { getStringIdFromErrorCode } from "@/locales/utils";
import type { CE_ErrorCode } from "@/server/common/error-code";

export class AppError extends Error {
    constructor(
        public readonly code: CE_ErrorCode,
        public readonly links: IErrorPageLink[] = [],
        public readonly showGoBack = false,
    ) {
        super("AppError");
    }

    public getStringId(): CE_Strings {
        return getStringIdFromErrorCode(this.code);
    }
}
