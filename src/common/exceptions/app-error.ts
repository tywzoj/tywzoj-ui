import type { CE_ErrorCode } from "@/server/common/error-code";

import type { ILocalizedStringFunctionErrorLink } from "../types/error-link";

export class AppError extends Error {
    constructor(
        public readonly code: CE_ErrorCode,
        public readonly links: ILocalizedStringFunctionErrorLink[] = [],
        public readonly showGoBack: boolean = false,
        message?: string,
    ) {
        super(message);
        this.name = "AppError";
    }
}
