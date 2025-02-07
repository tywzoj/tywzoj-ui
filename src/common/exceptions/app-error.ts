import type { CE_Strings } from "@/locales/types";
import { getStringIdFromErrorCode } from "@/locales/utils";
import type { CE_ErrorCode } from "@/server/common/error-code";

import type { IStringCodeErrorLink } from "../types/error-link";

export class AppError extends Error {
    public readonly code: CE_ErrorCode;
    public readonly links: IStringCodeErrorLink[];
    public readonly showGoBack: boolean;

    constructor(code: CE_ErrorCode, links?: IStringCodeErrorLink[], showGoBack?: boolean, message?: string) {
        super(message);
        this.name = "AppError";
        this.code = code;
        this.links = links ?? [];
        this.showGoBack = showGoBack ?? false;
    }

    public getStringId(): CE_Strings {
        return getStringIdFromErrorCode(this.code);
    }
}
