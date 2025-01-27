import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import type React from "react";
import { z } from "zod";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { calcCount } from "@/common/utils/pagination";
import { Z_ORDER, Z_PROBLEM_SORT_BY } from "@/common/validators/zod";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { CE_Order } from "@/server/common/types";
import { CE_ProblemSortBy } from "@/server/modules/problem.types";
import { withThrowErrors } from "@/server/utils";
import { getPagination } from "@/store/selectors";

const ProblemListPage: React.FC = () => {
    const { problemBasicDetails, count } = Route.useLoaderData();

    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_PROBLEMS,
    });

    useSetPageTitle(ls.title);

    console.log(problemBasicDetails, count);
    // TODO: render problem list

    return null;
};

const searchParams = z.object({
    p: fallback(z.number(), 1).default(1), // page
    o: fallback(Z_ORDER, CE_Order.ASC).default(CE_Order.ASC), // order
    s: fallback(Z_PROBLEM_SORT_BY, CE_ProblemSortBy.DisplayId).default(CE_ProblemSortBy.DisplayId), // sortBy
    t: fallback(z.boolean(), false).default(false).optional(), // showTags
    k: z.string().optional(), // keyword
    km: z.boolean().optional(), // keywordMatchesId
});

const queryOptions = createQueryOptions(CE_QueryId.ProblemList, withThrowErrors(ProblemModule.getProblemListAsync));

export const Route = createFileRoute("/problem/")({
    component: ProblemListPage,
    errorComponent: ErrorPageLazy,
    validateSearch: zodValidator(searchParams),
    loaderDeps: ({ search: { p, o, s, t, k, km } }) => ({
        page: p,
        order: o,
        sortBy: s,
        queryTags: t,
        keyword: k,
        keywordMatchesId: km,
    }),
    loader: async ({
        context: { queryClient, store },
        deps: { page, order, sortBy, queryTags, keyword, keywordMatchesId },
    }) => {
        const { problem: paginationCount } = getPagination(store.getState());
        const { skipCount, takeCount } = calcCount(page, paginationCount);
        const { data } = await queryClient.ensureQueryData(
            queryOptions({
                skipCount,
                takeCount,
                sortBy,
                order,
                queryTags,
                keyword,
                keywordMatchesId,
            }),
        );

        return data;
    },
});
