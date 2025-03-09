import { z } from "zod";

import { CE_ProblemSortBy } from "@/server/modules/problem.enums";

import { PROBLEM_TAG_NAME_MAX_LENGTH, PROBLEM_TITLE_MAX_LENGTH } from "../constants/data-length";

export const Z_PROBLEM_SORT_BY = z.enum([
    CE_ProblemSortBy.DisplayId,
    CE_ProblemSortBy.AcSubmissionCount,
    CE_ProblemSortBy.SubmissionCount,
    CE_ProblemSortBy.Title,
]);

export const Z_PROBLEM_TITLE = z.string().max(PROBLEM_TITLE_MAX_LENGTH);
export const Z_PROBLEM_TAG_NAME = z.string().max(PROBLEM_TAG_NAME_MAX_LENGTH);
