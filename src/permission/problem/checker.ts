import type { IPermissionState } from "@/store/types";

export function checkIsAllowedSubmitProblem(permission: IPermissionState): boolean {
    return permission.submitAnswer;
}

export function checkIsAllowedEditProblem(permission: IPermissionState): boolean {
    return permission.manageProblem;
}

export function checkIsAllowedCreateProblem(permission: IPermissionState): boolean {
    return checkIsAllowedEditProblem(permission);
}
