import type { CE_Visibility } from "../common/permission";
import type { IListRequest } from "../common/types";
import type { CE_ProblemFileType, CE_ProblemSortBy, CE_ProblemType } from "./problem.enums";

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

export interface IProblemFileDetailEditable {
    filename: string;
}

export interface IProblemFileDetail extends Readonly<IProblemFileDetailEditable> {
    problemId: number;
    uuid: string;
    type: CE_ProblemFileType;
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

export interface IProblemDetailPostRequestBody extends IProblemDetailEditable {
    content: IProblemContentDetailPostRequestBody;
    samples: IProblemSampleDetailPostRequestBody[];
    tagIds: number[];
}

export type IProblemDetailPostResponse = IProblemBasicDetail;

export interface IProblemDetailPatchRequestBody extends Partial<IProblemDetailEditable> {
    samples?: IProblemSampleDetailPostRequestBody[];
    tagIds?: number[];
}

// END: problem detail types

// BEGIN: problem content types

export type IProblemContentDetailPostRequestBody = IProblemContentDetailEditable;

export type IProblemContentDetailPatchRequestBody = Partial<IProblemContentDetailEditable>;

// END: problem content types

// BEGIN: problem sample types

export type IProblemSampleDetailPostRequestBody = IProblemSampleDetailEditable;

// END: problem sample types

// BEGIN: problem file types

export interface IProblemFileListGetResponse {
    readonly fileDetails: IProblemFileDetail[];
    readonly count: number;
}

export interface IProblemFileUploadRequestPostRequestBody {
    filename: string;
    type: CE_ProblemFileType;
    size: number;
}

export interface IProblemFileUploadFinishPostRequestBody {
    token: string;
}

// END: problem file types
