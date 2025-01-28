import type { CE_Visibility } from "../common/permission";
import type { IListRequest } from "../common/types";

// BEGIN: shared types

export const enum CE_ProblemType {
    Traditional = "traditional",
    SubmitAnswer = "submit-answer",
    Interaction = "interaction",
}

export const enum CE_ProblemFileType {
    Testdata = "testdata",
    Additional = "additional",
}

export interface IProblemBasicDetail {
    readonly id: number;
    readonly displayId: number;
    readonly title: string;
    readonly creationTime: Date;
    readonly submissionCount: number;
    readonly acceptedSubmissionCount: number;
    readonly visibility: CE_Visibility;
    readonly tags: IProblemTagDetail[];
}

export interface IProblemDetail extends IProblemBasicDetail {
    readonly type: CE_ProblemType;
    readonly content: IProblemContentDetail | null;
    readonly samples: IProblemSampleDetail[];
}

export interface IProblemContentDetail {
    readonly description: string;
    readonly inputFormat: string;
    readonly outputFormat: string;
    readonly limitAndHint: string;
}

export interface IProblemSampleDetail {
    readonly id: number;
    readonly problemId: number;
    readonly input: string;
    readonly output: string;
    readonly explanation: string;
}

export interface IProblemTagDetail {
    readonly id: number;
    readonly name: string;
    readonly color: string;
}

// END: shared types

// BEGIN: problem list types

export const enum CE_ProblemSortBy {
    DisplayId = "displayId",
    Title = "title",
    SubmissionCount = "submissionCount",
    AcSubmissionCount = "acceptedSubmissionCount",
}

export interface IProblemListGetRequestQuery extends IListRequest<CE_ProblemSortBy> {
    keyword?: string;
    keywordMatchesId?: boolean;
    tagIds?: number[];
    queryTags?: boolean;
}

export interface IProblemListGetResponse {
    readonly problemBasicDetails: IProblemBasicDetail[];
    readonly count: number;
}

// END: problem list types

// BEGIN: problem detail types

export interface IProblemDetailGetRequestQuery {
    queryTags?: boolean;
}

export type IProblemDetailGetResponse = IProblemDetail;

export interface IProblemDetailPostRequestBody {
    displayId: number;
    title: string;
    type: CE_ProblemType;
    visibility: CE_Visibility;
    content: IProblemContentDetailPostRequestBody;
    samples: IProblemSampleDetailPostRequestBody[];
    tagIds: number[];
}

export type IProblemDetailPostResponse = IProblemBasicDetail;

// END: problem detail types

// BEGIN: problem content types

export interface IProblemContentDetailPostRequestBody {
    description: string;
    inputFormat: string;
    outputFormat: string;
    limitAndHint: string;
}

// END: problem content types

// BEGIN: problem sample types

export interface IProblemSampleDetailPostRequestBody {
    input: string;
    output: string;
    explanation: string;
}

// END: problem sample types
