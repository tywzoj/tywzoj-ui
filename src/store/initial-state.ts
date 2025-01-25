import { getApiToken } from "@/common/utils/token";
import { isAndroid, isChrome, isEdge, isFireFox, isIOS, isMobile, isSafari } from "@/common/utils/user-agent";
import { isMiddleScreen, isMiniScreen, isSmallScreen } from "@/common/utils/window-width";
import { CE_Locale } from "@/locales/types";
import { CE_Theme } from "@/theme/types";

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
    },
    apiEndPoint: import.meta.env.TYWZOJ_API_END_POINT,
    permission: {} as IPermissionState, // Will be initialized after called the API
    pagination: {} as IPaginationState, // Will be initialized after called the API
    locale: {
        lang: CE_Locale.en,
        isRtl: false,
        strings: {} as ILocalizedStrings, // Will be initialized later
    },
};
