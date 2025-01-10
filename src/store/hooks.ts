import * as Selectors from "./selectors";
import { createAppStoreHook } from "./utils";

export const useIsChrome = createAppStoreHook(Selectors.getIsChrome);
export const useIsEdge = createAppStoreHook(Selectors.getIsEdge);
export const useIsFirefox = createAppStoreHook(Selectors.getIsFirefox);
export const useIsSafari = createAppStoreHook(Selectors.getIsSafari);
export const useIsAndroid = createAppStoreHook(Selectors.getIsAndroid);
export const useIsIOS = createAppStoreHook(Selectors.getIsIOS);
export const useIsMobile = createAppStoreHook(Selectors.getIsMobile);

export const useIsMiddleScreen = createAppStoreHook(Selectors.getIsMiddleScreen);
export const useIsSmallScreen = createAppStoreHook(Selectors.getIsSmallScreen);
export const useIsMiniScreen = createAppStoreHook(Selectors.getIsMiniScreen);

export const useIsMobileView = createAppStoreHook(Selectors.getIsMobileView);

export const useCurrentUser = createAppStoreHook(Selectors.getCurrentUser);
export const useToken = createAppStoreHook(Selectors.getToken);
export const useApiEndPoint = createAppStoreHook(Selectors.getApiEndPoint);

export const usePermission = createAppStoreHook(Selectors.getPermission);
export const usePagination = createAppStoreHook(Selectors.getPagination);
