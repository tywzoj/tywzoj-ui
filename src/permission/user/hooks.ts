import type { UserTypes } from "@/server/types";
import { useCurrentUser, usePermission } from "@/store/hooks";

import { checkIsAllowedEditUser, checkIsAllowedManageUser } from "./checker";

type IUserDetail = UserTypes.IUserDetail;

export const useIsAllowedEditUser = (user: IUserDetail): boolean => {
    const currentUser = useCurrentUser();
    const permission = usePermission();

    return checkIsAllowedEditUser(user, currentUser, permission);
};

export const useIsAllowedManageUser = (user: IUserDetail): boolean => {
    const currentUser = useCurrentUser();
    const permission = usePermission();

    return checkIsAllowedManageUser(user, currentUser, permission);
};
