import type { UserTypes } from "@/server/types";
import { useCurrentUser } from "@/store/hooks";

import { usePermission } from "../common/hooks";
import { checkIsAllowedEditUser, checkIsAllowedManageUser } from "./checker";

type IUserDetail = UserTypes.IUserDetail;

export const useIsAllowedEditUser = (user: IUserDetail): boolean => {
    const currentUser = useCurrentUser();
    const permission = usePermission();

    return checkIsAllowedEditUser(user, currentUser, permission);
};

export const useIsAllowedManageUser = (user: IUserDetail, allowedManageSelf = true): boolean => {
    const currentUser = useCurrentUser();
    const permission = usePermission();

    return checkIsAllowedManageUser(user, currentUser, permission, allowedManageSelf);
};
