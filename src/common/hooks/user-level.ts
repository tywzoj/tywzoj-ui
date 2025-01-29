import type { BadgeProps } from "@fluentui/react-components";
import React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_UserLevel } from "@/server/common/permission";

export const useUserLevelColor = (UserLevel: CE_UserLevel): Exclude<BadgeProps["color"], undefined> => {
    switch (UserLevel) {
        case CE_UserLevel.Admin:
            return "important";
        case CE_UserLevel.Manager:
            return "warning";
        case CE_UserLevel.Internal:
            return "success";
        case CE_UserLevel.Paid:
            return "brand";
        case CE_UserLevel.General:
            return "informative";
        case CE_UserLevel.Specific:
            return "severe";
        case CE_UserLevel.Disabled:
            return "danger";
    }
};

export const useUserLevelString = (UserLevel: CE_UserLevel) => {
    const localeId = React.useMemo((): CE_Strings => {
        switch (UserLevel) {
            case CE_UserLevel.Admin:
                return CE_Strings.USER_LEVEL_LABEL_ADMIN;
            case CE_UserLevel.Manager:
                return CE_Strings.USER_LEVEL_LABEL_MANAGER;
            case CE_UserLevel.Internal:
                return CE_Strings.USER_LEVEL_LABEL_INTERNAL;
            case CE_UserLevel.Paid:
                return CE_Strings.USER_LEVEL_LABEL_PAID;
            case CE_UserLevel.General:
                return CE_Strings.USER_LEVEL_LABEL_GENERAL;
            case CE_UserLevel.Specific:
                return CE_Strings.USER_LEVEL_LABEL_SPECIFIC;
            case CE_UserLevel.Disabled:
                return CE_Strings.USER_LEVEL_LABEL_DISABLED;
        }
    }, [UserLevel]);

    return useLocalizedStrings(localeId)[0];
};
