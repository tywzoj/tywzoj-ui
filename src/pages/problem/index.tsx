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
});

const getQueryOptions = withThrowErrors(ProblemModule.getProblemListAsync);

export const Route = createFileRoute("/problem/")({
    component: ProblemListPage,
    errorComponent: ErrorPageLazy,
    validateSearch: zodValidator(searchParams),
    loaderDeps: ({ search: { p, o, s } }) => ({ page: p, order: o, sortBy: s }),
    loader: async ({ context: { store }, deps: { page, order, sortBy } }) => {
        const { problem: paginationCount } = getPagination(store.getState());
        const { skipCount, takeCount } = calcCount(page, paginationCount);
        const { data } = await getQueryOptions({
            skipCount,
            takeCount,
            sortBy,
            order,
        });

        return data;
    },
});
