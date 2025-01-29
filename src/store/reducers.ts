import type { Reducer } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";

import { setLocaleAction } from "@/locales/actions";
import { setThemeAction } from "@/theme/actions";

import {
    setAuthAction,
    setEnvAction,
    setFeatureAction,
    setPageTitleAction,
    setPaginationAction,
    setPermissionAction,
    setPreferenceAction,
} from "./actions";
import { initialState } from "./initial-state";
import type { IRootState } from "./types";

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
        .addCase(setLocaleAction, (state, action) => {
            return {
                ...state,
                locale: {
                    ...state.locale,
                    ...action.payload,
                },
            };
        })
        .addCase(setPreferenceAction, (state, action) => {
            return {
                ...state,
                preference: {
                    ...state.preference,
                    ...action.payload,
                },
            };
        })
        .addCase(setPermissionAction, (state, action) => {
            return {
                ...state,
                permission: action.payload,
            };
        })
        .addCase(setPaginationAction, (state, action) => {
            return {
                ...state,
                pagination: action.payload,
            };
        })
        .addCase(setFeatureAction, (state, action) => {
            return {
                ...state,
                feature: action.payload,
            };
        })
        .addCase(setAuthAction, (state, action) => {
            return {
                ...state,
                auth: {
                    ...state.auth,
                    ...action.payload,
                },
            };
        })
        .addCase(setPageTitleAction, (state, action) => {
            return {
                ...state,
                pageTitle: action.payload,
            };
        });
});
