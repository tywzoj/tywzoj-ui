import { useAppSelector } from "@/store/hooks";

import { getTheme } from "./selectors";

export const useTheme = () => useAppSelector(getTheme);
