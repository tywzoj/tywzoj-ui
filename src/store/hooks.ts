import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

import * as Selectors from "./selectors";
import type { IAppDispatch, IRootState } from "./types";

export const useAppDispatch: () => IAppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;

export const useIsChrome = () => useAppSelector(Selectors.getIsChrome);
export const useIsEdge = () => useAppSelector(Selectors.getIsEdge);
export const useIsFirefox = () => useAppSelector(Selectors.getIsFirefox);
export const useIsSafari = () => useAppSelector(Selectors.getIsSafari);
export const useIsAndroid = () => useAppSelector(Selectors.getIsAndroid);
export const useIsIOS = () => useAppSelector(Selectors.getIsIOS);
export const useIsMobile = () => useAppSelector(Selectors.getIsMobile);

export const useIsMiddleScreen = () => useAppSelector(Selectors.getIsMiddleScreen);
export const useIsSmallScreen = () => useAppSelector(Selectors.getIsSmallScreen);
export const useIsMiniScreen = () => useAppSelector(Selectors.getIsMiniScreen);

export const useIsMobileView = () => useAppSelector(Selectors.getIsMobileView);

export const useCurrentUser = () => useAppSelector(Selectors.getCurrentUser);
export const useToken = () => useAppSelector(Selectors.getToken);
export const useApiEndPoint = () => useAppSelector(Selectors.getApiEndPoint);

export const usePermission = () => useAppSelector(Selectors.getPermission);
export const usePagination = () => useAppSelector(Selectors.getPagination);
export const useFeature = () => useAppSelector(Selectors.getFeature);
