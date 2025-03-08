import { usePermission } from "@/store/hooks";

import { checkIsAllowedCreateProblem, checkIsAllowedEditProblem, checkIsAllowedSubmitProblem } from "./checker";

export const useIsAllowedSubmitProblem = (): boolean => {
    const permission = usePermission();

    return checkIsAllowedSubmitProblem(permission);
};

export const useIsAllowedEditProblem = (): boolean => {
    const permission = usePermission();

    return checkIsAllowedEditProblem(permission);
};

export const useIsAllowedCreateProblem = (): boolean => {
    const permission = usePermission();

    return checkIsAllowedCreateProblem(permission);
};
