import React from "react";

import type { CE_ErrorCode } from "@/server/common/error-code";
import { useAppSelector } from "@/store/hooks";

import type { CE_Strings } from "./locale";
import { getIsRtl, getStrings } from "./selectors";
import { getLocalizedStringWithFallback, getStringIdFromErrorCode } from "./utils";

export function useLocalizedStrings<T extends Record<string, CE_Strings>>(
    customKeyStringMapObject: T,
): { [K in keyof T]: ILocalizedStrings[T[K]] };
export function useLocalizedStrings<T extends CE_Strings[]>(...keys: T): { [K in keyof T]: ILocalizedStrings[T[K]] };
export function useLocalizedStrings(first?: Record<string, CE_Strings> | CE_Strings, ...args: CE_Strings[]) {
    const strings = useAppSelector(getStrings);

    return React.useMemo(() => {
        if (typeof first === "object") {
            return Object.fromEntries(
                Object.entries(first).map(([key, value]) => [key, getLocalizedStringWithFallback(strings, value)]),
            );
        } else {
            return [
                first && getLocalizedStringWithFallback(strings, first),
                ...args.map((key) => getLocalizedStringWithFallback(strings, key)),
            ];
        }
    }, [first, strings, args]);
}

export const useIsRtl = () => useAppSelector(getIsRtl);

export const useErrorCodeToString = () => {
    const strings = useAppSelector(getStrings);

    return React.useCallback(
        (code: CE_ErrorCode) => getLocalizedStringWithFallback(strings, getStringIdFromErrorCode(code)),
        [strings],
    );
};
