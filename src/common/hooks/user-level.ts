import type { BadgeProps } from "@fluentui/react-components";
import React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { CE_UserLevel } from "@/server/common/permission";

import { neverGuard } from "../utils/never-guard";

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
        default:
            neverGuard(UserLevel);
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
            default:
                neverGuard(UserLevel);
        }
    }, [UserLevel]);

    return useLocalizedStrings(localeId)[0];
};

export const useUserLevelStringMap = (): Record<CE_UserLevel, string> => {
    const strings = useLocalizedStrings(
        CE_Strings.USER_LEVEL_LABEL_ADMIN,
        CE_Strings.USER_LEVEL_LABEL_MANAGER,
        CE_Strings.USER_LEVEL_LABEL_INTERNAL,
        CE_Strings.USER_LEVEL_LABEL_PAID,
        CE_Strings.USER_LEVEL_LABEL_GENERAL,
        CE_Strings.USER_LEVEL_LABEL_SPECIFIC,
        CE_Strings.USER_LEVEL_LABEL_DISABLED,
    );

    return {
        [CE_UserLevel.Admin]: strings[0],
        [CE_UserLevel.Manager]: strings[1],
        [CE_UserLevel.Internal]: strings[2],
        [CE_UserLevel.Paid]: strings[3],
        [CE_UserLevel.General]: strings[4],
        [CE_UserLevel.Specific]: strings[5],
        [CE_UserLevel.Disabled]: strings[6],
    };
};
