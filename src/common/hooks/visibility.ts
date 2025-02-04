import type { BadgeProps } from "@fluentui/react-components";
import React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
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
    const localeId = React.useMemo((): CE_Strings => {
        switch (visibility) {
            case CE_Visibility.Public:
                return CE_Strings.VISIBILITY_LABEL_PUBLIC;
            case CE_Visibility.Private:
                return CE_Strings.VISIBILITY_LABEL_PRIVATE;
            case CE_Visibility.Internal:
                return CE_Strings.VISIBILITY_LABEL_INTERNAL;
            case CE_Visibility.Paid:
                return CE_Strings.VISIBILITY_LABEL_PAID;
            default:
                neverGuard(visibility);
        }
    }, [visibility]);

    return useLocalizedStrings(localeId)[0];
};
