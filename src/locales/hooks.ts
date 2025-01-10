import React from "react";

import { useAppSelector } from "@/store/hooks";

import { getStrings } from "./selectors";
import type { CE_Strings } from "./types";
import { getLocalizedStringWithFallback } from "./utils";

export function useLocalizedStrings<T extends Record<string, CE_Strings>>(
    customKeyStringMapObject: T,
): { [K in keyof T]: ILocalizedStrings[T[K]] };
export function useLocalizedStrings<T extends CE_Strings[]>(...keys: T): { [K in keyof T]: ILocalizedStrings[T[K]] };
export function useLocalizedStrings(first?: Record<string, CE_Strings> | CE_Strings, ...args: CE_Strings[]) {
    const strings = useAppSelector(getStrings);

    return React.useMemo(() => {
        if (typeof first === "object") {
            return Object.entries(first).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: getLocalizedStringWithFallback(strings, value) }),
                {},
            );
        } else {
            return [first, ...args.map((key) => getLocalizedStringWithFallback(strings, key))];
        }
    }, [first, strings, args]);
}
