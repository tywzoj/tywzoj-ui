import { CE_CommonPermission } from "@/server/common/permission";
import type { UserTypes } from "@/server/types";
import type { IPermissionState } from "@/store/types";

import { checkCommonPermission } from "../common/checker";

type IUserDetailNullable = UserTypes.IUserDetail | null;
type IUserDetail = UserTypes.IUserDetail;

export function checkIsAllowedEditUserId(
    userId: number,
    currentUser: IUserDetailNullable,
    permission: IPermissionState,
): boolean {
    return !!currentUser && (permission.manageUser || userId === currentUser.id);
}

export function checkIsAllowedEditUser(
    user: IUserDetail,
    currentUser: IUserDetailNullable,
    permission: IPermissionState,
): boolean {
    if (!currentUser) {
        return false;
    }

    if (user.id === currentUser.id) {
        return true;
    }

    return checkIsAllowedManageUser(user, currentUser, permission);
}

export function checkIsAllowedManageUser(
    user: IUserDetail,
    currentUser: IUserDetailNullable,
    permission: IPermissionState,
    allowedManageSelf = true,
): boolean {
    if (!currentUser) {
        return false;
    }

    if (!allowedManageSelf && user.id === currentUser.id) {
        return false;
    }

    // Can't edit other admins
    if (user.id !== currentUser.id && checkCommonPermission(CE_CommonPermission.ManageUser, user.level)) {
        return false;
    }

    return permission.manageUser;
}
