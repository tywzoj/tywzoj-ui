import { useAppSelector } from "@/store/hooks";

import { getPermission } from "./selectors";

export const usePermission = () => useAppSelector(getPermission);
