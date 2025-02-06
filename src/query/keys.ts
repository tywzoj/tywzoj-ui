import type { ProblemModule } from "@/server/api";

import { CE_QueryId } from "./id";
import { createQueryKeys } from "./utils";

export const problemListQueryKeys = createQueryKeys<typeof ProblemModule.getProblemListAsync>(CE_QueryId.ProblemList);
export const problemDetailQueryKeys = createQueryKeys<typeof ProblemModule.getProblemDetailAsync>(
    CE_QueryId.ProblemDetail,
);
