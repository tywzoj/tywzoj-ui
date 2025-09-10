import type { BadgeProps } from "@fluentui/react-components";
import React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Visibility } from "@/server/common/permission";

import { neverGuard } from "../utils/never-guard";

export const useVisibilityColor = (visibility: CE_Visibility): Exclude<BadgeProps["color"], undefined> => {
    switch (visibility) {
        case CE_Visibility.Private:
            return "danger";
        case CE_Visibility.Internal:
            return "success";
        case CE_Visibility.Paid:
            return "brand";
        case CE_Visibility.Public:
            return "informative";
        default:
            neverGuard(visibility);
    }
};

export const useVisibilityString = (visibility: CE_Visibility) => {
    const ls = useLocalizedStrings();

    return React.useMemo((): string => {
        switch (visibility) {
            case CE_Visibility.Public:
                return ls.$VISIBILITY_LABEL_PUBLIC;
            case CE_Visibility.Private:
                return ls.$VISIBILITY_LABEL_PRIVATE;
            case CE_Visibility.Internal:
                return ls.$VISIBILITY_LABEL_INTERNAL;
            case CE_Visibility.Paid:
                return ls.$VISIBILITY_LABEL_PAID;
            default:
                neverGuard(visibility);
        }
    }, [ls, visibility]);
};
