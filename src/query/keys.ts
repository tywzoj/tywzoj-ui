import type { AuthModule, ProblemModule, UserModule } from "@/server/api";

import { CE_QueryId } from "./id";
import { createQueryKeysFn } from "./utils";

export const authDetailQueryKeys = createQueryKeysFn<typeof AuthModule.getAuthDetailAsync>(CE_QueryId.AuthDetail);

export const problemListQueryKeys = createQueryKeysFn<typeof ProblemModule.getProblemListAsync>(CE_QueryId.ProblemList);
export const problemDetailQueryKeys = createQueryKeysFn<typeof ProblemModule.getProblemDetailAsync>(
    CE_QueryId.ProblemDetail,
);

export const userDetailQueryKeys = createQueryKeysFn<typeof UserModule.getUserDetailAsync>(CE_QueryId.UserDetail);
