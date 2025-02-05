import type { CE_Visibility } from "../common/permission";
import type { IListRequest } from "../common/types";
import type { CE_ProblemSortBy, CE_ProblemType } from "./problem.enums";

// BEGIN: shared types

export interface IProblemBasicDetailEditable {
    displayId: number;
    title: string;
    visibility: CE_Visibility;
}

export interface IProblemBasicDetail extends Readonly<IProblemBasicDetailEditable> {
    readonly id: number;
    readonly creationTime: Date;
    readonly submissionCount: number;
    readonly acceptedSubmissionCount: number;
    readonly tags: IProblemTagDetail[];
}

export interface IProblemDetailEditable extends IProblemBasicDetailEditable {
    type: CE_ProblemType;
}

export interface IProblemDetail extends IProblemBasicDetail, Readonly<IProblemDetailEditable> {
    readonly content: IProblemContentDetail | null;
    readonly samples: IProblemSampleDetail[];
}

export interface IProblemContentDetailEditable {
    description: string;
    inputFormat: string;
    outputFormat: string;
    limitAndHint: string;
}

export type IProblemContentDetail = Readonly<IProblemContentDetailEditable>;

export interface IProblemSampleDetailEditable {
    input: string;
    output: string;
    explanation: string;
}

export interface IProblemSampleDetail extends Readonly<IProblemSampleDetailEditable> {
    readonly id: number;
    readonly problemId: number;
}

export interface IProblemTagDetailEditable {
    readonly name: string;
    readonly color: string;
}

export interface IProblemTagDetail extends Readonly<IProblemTagDetailEditable> {
    readonly id: number;
}

// END: shared types

// BEGIN: problem list types

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
