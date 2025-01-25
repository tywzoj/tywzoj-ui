import { useAppSelector } from "@/store/hooks";

import { getIsLightTheme, getTheme } from "./selectors";

export const useTheme = () => useAppSelector(getTheme);
export const useIsLightTheme = () => useAppSelector(getIsLightTheme);
