import { CE_Theme } from "@/theme/types";
import { getApiToken } from "@/utils/token";
import { isAndroid, isChrome, isEdge, isFireFox, isIOS, isMobile, isSafari } from "@/utils/user-agent";
import { isMiddleScreen, isMiniScreen, isSmallScreen } from "@/utils/window-width";

import type { IPaginationState, IPermissionState, IRootState } from "./types";

export const initialState: IRootState = {
    theme: CE_Theme.Light,
    env: {
        isChrome: isChrome(),
        isEdge: isEdge(),
        isFirefox: isFireFox(),
        isSafari: isSafari(),
        isAndroid: isAndroid(),
        isIOS: isIOS(),
        isMobile: isMobile(),

        isMiddleScreen: isMiddleScreen(),
        isSmallScreen: isSmallScreen(),
        isMiniScreen: isMiniScreen(),
    },
    auth: {
        user: null, // Will be initialized after called the API
        token: getApiToken(),
        apiEndPoint: import.meta.env.TYWZOJ_API_END_POINT,
    },
    permission: {} as IPermissionState, // Will be initialized after called the API
    pagination: {} as IPaginationState, // Will be initialized after called the API
};
