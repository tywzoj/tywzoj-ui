import type { CE_Locale } from "@/locales/locale";
import type { CE_Theme } from "@/theme/types";

import type { CE_UserLevel } from "../common/permission";

export interface IUserDetail {
    readonly id: number;
    readonly username: string;
    readonly avatar: string | null;
    readonly email: string | null;
    readonly bio: string | null;
    readonly level: CE_UserLevel;
    readonly nickname: string | null;
    readonly acceptedProblemCount: number;
    readonly submissionCount: number;
    readonly rating: number;
    readonly registrationTime: Date;
}

export interface IUserPreferenceDetail {
    readonly userId: number;
    readonly preferTheme: CE_Theme | null;
    readonly preferLanguage: CE_Locale | null;
    readonly showTagsOnProblemList: boolean;
    readonly showTagsOnProblemDetail: boolean;
}
