import type { ProblemModule } from "@/server/api";

import { CE_QueryId } from "./id";
import { createQueryKeysFn } from "./utils";

export const problemListQueryKeys = createQueryKeysFn<typeof ProblemModule.getProblemListAsync>(CE_QueryId.ProblemList);
export const problemDetailQueryKeys = createQueryKeysFn<typeof ProblemModule.getProblemDetailAsync>(
    CE_QueryId.ProblemDetail,
);
