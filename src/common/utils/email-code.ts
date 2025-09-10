import type { CE_EmailVerificationCodeType } from "../enums/email-code-type";
import { getLocalStorage } from "./safe-storage";

const KEY_PREFIX = "email_verification_code_";

function makeKey(type: CE_EmailVerificationCodeType, email: string): string {
    return `${KEY_PREFIX}_${type}_${email}`;
}

export function getEmailVerificationCodeRateLimit(type: CE_EmailVerificationCodeType, email: string): number {
    const value = getLocalStorage().getItem(makeKey(type, email));
    return value ? Number.parseInt(value, 10) || 0 : 0;
}

export function setEmailVerificationCodeSentTime(type: CE_EmailVerificationCodeType, email: string): void {
    getLocalStorage().setItem(makeKey(type, email), Date.now().toString());
}
