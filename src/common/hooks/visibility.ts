import React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_Visibility } from "@/server/common/permission";

export const useVisibilityColor = (visibility: CE_Visibility) => {
    switch (visibility) {
        case CE_Visibility.Public:
            return "success";
        case CE_Visibility.Private:
            return "danger";
        case CE_Visibility.Internal:
            return "important";
        case CE_Visibility.Paid:
            return "brand";
    }
};

export const useVisibilityString = (visibility: CE_Visibility) => {
    const localeId = React.useMemo(() => {
        switch (visibility) {
            case CE_Visibility.Public:
                return CE_Strings.VISIBILITY_LABEL_PUBLIC;
            case CE_Visibility.Private:
                return CE_Strings.VISIBILITY_LABEL_PRIVATE;
            case CE_Visibility.Internal:
                return CE_Strings.VISIBILITY_LABEL_INTERNAL;
            case CE_Visibility.Paid:
                return CE_Strings.VISIBILITY_LABEL_PAID;
        }
    }, [visibility]);

    return useLocalizedStrings(localeId)[0];
};
