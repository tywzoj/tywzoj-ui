import { createAppSelector } from "@/store/utils";

export const getTheme = createAppSelector((state) => state.theme);
