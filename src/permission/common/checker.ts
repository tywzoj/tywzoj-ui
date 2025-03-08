import type { CE_CommonPermission } from "@/server/common/permission";
import { CE_UserLevel } from "@/server/common/permission";

export function checkCommonPermission(permission: CE_CommonPermission, userLevel: CE_UserLevel): boolean {
    return userLevel >= permission;
}

export function isSpecificUser(userLevel: CE_UserLevel): userLevel is CE_UserLevel.Specific {
    return userLevel === CE_UserLevel.Specific;
}
