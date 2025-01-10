import type { Reducer } from "@reduxjs/toolkit";
import { createReducer } from "@reduxjs/toolkit";

import { setThemeAction } from "@/theme/actions";

import { setEnvAction, setPaginationAction, setPermissionAction } from "./actions";
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
        });
});
