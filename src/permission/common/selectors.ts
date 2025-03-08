import { createAppSelector } from "@/store/utils";

export const getPermission = createAppSelector((state) => state.permission);
