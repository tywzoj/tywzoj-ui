import React from "react";

import type { CE_ErrorCode } from "@/server/common/error-code";
import { useAppSelector } from "@/store/hooks";

import { getIsRtl, getStrings } from "./selectors";

export const useLocalizedStrings = () => useAppSelector(getStrings);

export const useIsRtl = () => useAppSelector(getIsRtl);

export const useErrorCodeToString = () => {
    const strings = useAppSelector(getStrings);

    return React.useCallback(
        (code: CE_ErrorCode) => strings[`E_${code}` as keyof typeof strings] || "Unknown error",
        [strings],
    );
};
