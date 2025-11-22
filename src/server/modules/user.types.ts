import type { CE_Locale } from "@/locales/locale";
import type { CE_Theme } from "@/theme/types";

import type { CE_UserLevel } from "../common/permission";
import type { IListRequest } from "../common/types";
import type { CE_ProblemSortBy } from "./problem.enums";

// BEGIN: shared types
export interface IUserDetailEditable {
    username: string;
    bio: string | null;
    email: string | null;
    level: CE_UserLevel;
    nickname: string | null;
}

export interface IUserDetail extends Readonly<IUserDetailEditable> {
    readonly id: number;
    readonly avatar: string | null;
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

// END: shared types

// BEGIN: user list types

export type IProblemListGetRequestQuery = IListRequest<CE_ProblemSortBy>;

export interface IUserListGetResponse {
    readonly userDetails: IUserDetail[];
    readonly count: number;
}

// END: user list types

// BEGIN: user detail types

export type IUserDetailGetResponse = IUserDetail;

export interface IUserDetailPatchRequestBody extends Partial<IUserDetailEditable> {
    emailVerificationCode?: string;
}

// END: user detail types
