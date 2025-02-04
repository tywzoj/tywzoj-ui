import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";

const ProblemEditPage: React.FC = () => {
    // TODO: Implement page

    return null;
};

const queryOptions = createQueryOptions(CE_QueryId.ProblemDetail, withThrowErrors(ProblemModule.getProblemDetailAsync));

export const Route = createFileRoute("/problem/$displayId/edit")({
    component: ProblemEditPage,
    loader: async ({ context: { queryClient }, params: { displayId } }) => {
        const { data } = await queryClient.ensureQueryData(
            queryOptions(displayId, {
                queryTags: true,
            }),
        );

        return data;
    },
});
