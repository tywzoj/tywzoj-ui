import { createSelector } from "@reduxjs/toolkit";

import { createAppSelector } from "@/store/utils";

import { CE_Theme } from "./types";

export const getTheme = createAppSelector((state) => state.theme);
export const getIsLightTheme = createSelector(getTheme, (theme) => theme == CE_Theme.Light);
