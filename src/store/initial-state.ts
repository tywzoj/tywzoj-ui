import { getApiToken } from "@/common/utils/token";
import { isAndroid, isChrome, isEdge, isFireFox, isIOS, isMobile, isSafari } from "@/common/utils/user-agent";
import { isMiddleScreen, isMiniScreen, isSmallScreen } from "@/common/utils/window-width";
import { defaultLanguage } from "@/locales/locale";
import { CE_Theme } from "@/theme/types";

import type { IFeatureState, IPaginationState, IPermissionState, IRootState } from "./types";

export const initialState: IRootState = {
    theme: CE_Theme.Light,
    pageTitle: "",
    apiEndPoint: import.meta.env.TYWZOJ_API_END_POINT,
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
    locale: {
        lang: defaultLanguage,
        isRtl: false,
        strings: {} as ILocalizedStrings, // Will be initialized later
    },
    auth: {
        user: null, // Will be initialized after called the API
        token: getApiToken(),
    },
    preference: {
        showTagsOnProblemDetail: false,
        showTagsOnProblemList: false,
    },
    permission: {} as IPermissionState, // Will be initialized after called the API
    pagination: {} as IPaginationState, // Will be initialized after called the API
    feature: {} as IFeatureState, // Will be initialized after called the API
};
