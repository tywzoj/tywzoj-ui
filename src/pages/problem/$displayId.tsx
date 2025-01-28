import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { withThrowErrors } from "@/server/utils";

const ProblemDetailPage: React.FC = () => {
    const problem = Route.useLoaderData();

    useSetPageTitle(`#${problem.displayId}.${problem.title}`);

    return null;
};

const queryOptions = createQueryOptions(CE_QueryId.ProblemDetail, withThrowErrors(ProblemModule.getProblemDetailAsync));

export const Route = createFileRoute("/problem/$displayId")({
    component: ProblemDetailPage,
    errorComponent: ErrorPageLazy,
    loader: async ({ context: { queryClient }, params: { displayId } }) => {
        const { data } = await queryClient.fetchQuery(
            queryOptions(displayId, {
                queryTags: false,
            }),
        );

        return data;
    },
});
