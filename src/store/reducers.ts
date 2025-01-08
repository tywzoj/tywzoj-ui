import type { Reducer } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";

import { CE_Theme } from "@/theme/types";
import { getApiToken } from "@/utils/token";
import {
    isAndroid,
    isChrome,
    isEdge,
    isFireFox,
    isIOS,
    isMiddleScreen,
    isMiniScreen,
    isMobile,
    isMobileView,
    isSafari,
    isSmallScreen,
} from "@/utils/user-agent";

import { setEnvAction, setPermissionAction, setThemeAction } from "./actions";
import type { IRootState } from "./types";

const initialState: IRootState = {
    theme: CE_Theme.Light,
    env: {
        isChrome: isChrome(),
        isEdge: isEdge(),
        isFirefox: isFireFox(),
        isSafari: isSafari(),

        isAndroid: isAndroid(),
        isIOS: isIOS(),

        isMiddleScreen: isMiddleScreen(),
        isSmallScreen: isSmallScreen(),
        isMiniScreen: isMiniScreen(),

        isMobile: isMobile(),
        isMobileView: isMobileView(),
    },
    auth: {
        user: null,
        token: getApiToken(),
        apiEndPoint: import.meta.env.TYWZOJ_API_END_POINT,
    },
    permission: {
        signUp: false,
        manageUser: false,
        manageProblem: false,
        accessHomework: false,
        accessContest: false,
        accessProblem: false,
        accessSite: false,
        submitAnswer: false,
    },
};

export const reducer: Reducer<IRootState> = createReducer<IRootState>(initialState, (builder) => {
    builder
        .addCase(setEnvAction, (state, action) => {
            return {
                ...state,
                env: {
                    ...state.env,
                    ...action.payload,
                },
            };
        })
        .addCase(setThemeAction, (state, action) => {
            return {
                ...state,
                theme: action.payload,
            };
        })
        .addCase(setPermissionAction, (state, action) => {
            return {
                ...state,
                permission: action.payload,
            };
        });
});
