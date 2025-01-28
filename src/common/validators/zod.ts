import { z } from "zod";

import { CE_Order } from "@/server/common/types";
import { CE_ProblemSortBy } from "@/server/modules/problem.types";

export const Z_ORDER = z.enum([CE_Order.ASC, CE_Order.DESC]);

export const Z_PROBLEM_SORT_BY = z.enum([
    CE_ProblemSortBy.DisplayId,
    CE_ProblemSortBy.AcSubmissionCount,
    CE_ProblemSortBy.SubmissionCount,
    CE_ProblemSortBy.Title,
]);
