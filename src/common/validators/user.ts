import { z } from "zod";

import { CE_UserSortBy } from "@/server/modules/user.enums";

import {
    EMAIL_MAX_LENGTH,
    NICKNAME_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
} from "../constants/data-length";

export const Z_USER_SORTBY = z.enum([CE_UserSortBy.Id, CE_UserSortBy.AcceptedProblemCount, CE_UserSortBy.Rating]);

export const Z_USERNAME = z.string().regex(/^[a-zA-Z0-9\-_.#$]{3,24}$/);
export const Z_NICKNAME = z.string().max(NICKNAME_MAX_LENGTH);
export const Z_EMAIL = z.string().max(EMAIL_MAX_LENGTH).email();
export const Z_PASSWORD = z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH);
