import { CE_ErrorCode } from "@/server/common/error-code";

import { AppError } from "./app-error";

export class PermissionDeniedError extends AppError {
    constructor() {
        super(CE_ErrorCode.PermissionDenied, [] /* links */, true /* showGoBack */, "Permission denied");
    }
}
