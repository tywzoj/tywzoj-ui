import type { UserTypes } from "@/server/types";
import type { IPermissionState } from "@/store/types";

type ICurrentUser = UserTypes.IUserDetail | null;
type IId = number | string;

export function canEditUserSettings(userId: IId, currentUser: ICurrentUser, permission: IPermissionState): boolean {
    return !!currentUser && (permission.manageUser || Number(userId) === currentUser.id);
}

export function canEditProblems(permission: IPermissionState): boolean {
    return permission.manageProblem;
}
