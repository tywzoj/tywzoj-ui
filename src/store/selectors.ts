import { createSelector } from "@reduxjs/toolkit";

import { createAppSelector } from "./utils";

export const getIsChrome = createAppSelector((state) => state.env.isChrome);
export const getIsEdge = createAppSelector((state) => state.env.isEdge);
export const getIsFirefox = createAppSelector((state) => state.env.isFirefox);
export const getIsSafari = createAppSelector((state) => state.env.isSafari);
export const getIsAndroid = createAppSelector((state) => state.env.isAndroid);
export const getIsIOS = createAppSelector((state) => state.env.isIOS);
export const getIsMobile = createAppSelector((state) => state.env.isMobile);

export const getIsMiddleScreen = createAppSelector((state) => state.env.isMiddleScreen);
export const getIsSmallScreen = createAppSelector((state) => state.env.isSmallScreen);
export const getIsMiniScreen = createAppSelector((state) => state.env.isMiniScreen);

export const getIsMobileView = createSelector(
    [getIsMobile, getIsMiniScreen],
    (isMobile, isMiniScreen) => isMobile || isMiniScreen,
);

export const getCurrentUser = createAppSelector((state) => state.auth.user);
export const getToken = createAppSelector((state) => state.auth.token);

export const getApiEndPoint = createAppSelector((state) => state.apiEndPoint);

export const getPermission = createAppSelector((state) => state.permission);
export const getPagination = createAppSelector((state) => state.pagination);
export const getFeature = createAppSelector((state) => state.feature);
