import type { BadgeProps } from "@fluentui/react-components";
import React from "react";

import { useLocalizedStrings } from "@/locales/hooks";
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

export const useUserLevelStringMap = (): Record<CE_UserLevel, string> => {
    const ls = useLocalizedStrings();

    return React.useMemo(
        () => ({
            [CE_UserLevel.Admin]: ls.$USER_LEVEL_LABEL_ADMIN,
            [CE_UserLevel.Manager]: ls.$USER_LEVEL_LABEL_MANAGER,
            [CE_UserLevel.Internal]: ls.$USER_LEVEL_LABEL_INTERNAL,
            [CE_UserLevel.Paid]: ls.$USER_LEVEL_LABEL_PAID,
            [CE_UserLevel.General]: ls.$USER_LEVEL_LABEL_GENERAL,
            [CE_UserLevel.Specific]: ls.$USER_LEVEL_LABEL_SPECIFIC,
            [CE_UserLevel.Disabled]: ls.$USER_LEVEL_LABEL_DISABLED,
        }),
        [ls],
    );
};

export const useUserLevelString = (UserLevel: CE_UserLevel) => useUserLevelStringMap()[UserLevel];
