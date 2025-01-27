import {
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    tokens,
    useTableCompositeNavigation,
} from "@fluentui/react-components";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import type React from "react";
import { z } from "zod";

import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { flex } from "@/common/styles/flex";
import { calcCount } from "@/common/utils/pagination";
import { percent } from "@/common/utils/percent";
import { Z_ORDER, Z_PROBLEM_SORT_BY } from "@/common/validators/zod";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { VisibilityLabel } from "@/components/VisibilityLable";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { CE_Order } from "@/server/common/types";
import { CE_ProblemSortBy } from "@/server/modules/problem.types";
import { withThrowErrors } from "@/server/utils";
import { useIsMiddleScreen } from "@/store/hooks";
import { getPagination } from "@/store/selectors";

const ProblemListPage: React.FC = () => {
    const { problemBasicDetails } = Route.useLoaderData();
    const isMiddleScreen = useIsMiddleScreen();
    const navigate = Route.useNavigate();

    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_PROBLEMS,
    });

    useSetPageTitle(ls.title);

    const styles = useStyles();

    const navigateToProblem = (displayId: number) => {
        navigate({
            to: "/problem/$displayId",
            params: { displayId: `${displayId}` },
        });
    };

    const { tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

    return (
        <div className={styles.root}>
            <div className={styles.header}></div>
            <div className={styles.body}>
                <Table onKeyDown={onTableKeyDown} {...tableTabsterAttribute}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell className={styles.tableIdCol}>ID</TableHeaderCell>
                            <TableHeaderCell>Title</TableHeaderCell>
                            <TableHeaderCell className={styles.tableVisibleCol}>Visible</TableHeaderCell>
                            {!isMiddleScreen && (
                                <>
                                    <TableHeaderCell className={styles.tableSubmissionCol}>Submission</TableHeaderCell>
                                    <TableHeaderCell className={styles.tableAcceptanceCol}>Acceptance</TableHeaderCell>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {problemBasicDetails.map((problem) => (
                            <TableRow
                                key={problem.id}
                                tabIndex={0}
                                role="row"
                                onClick={() => navigateToProblem(problem.displayId)}
                                onKeyDown={(e: KeyboardEvent) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        navigateToProblem(problem.displayId);
                                    }
                                }}
                            >
                                <TableCell>{problem.displayId}</TableCell>
                                <TableCell>{problem.title}</TableCell>
                                <TableCell>
                                    <VisibilityLabel visibility={problem.visibility} />
                                </TableCell>
                                {!isMiddleScreen && (
                                    <>
                                        <TableCell>{problem.submissionCount}</TableCell>
                                        <TableCell>
                                            {percent(problem.acceptedSubmissionCount, problem.submissionCount)}
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className={styles.footer}></div>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex(),
        width: "100%",
        boxSizing: "border-box",
    },
    header: {},
    body: {
        padding: "20px",
        boxShadow: tokens.shadow2Brand,
        borderRadius: tokens.borderRadiusSmall,
    },
    footer: {},
    tableIdCol: {
        width: "60px",
    },
    tableVisibleCol: {
        width: "80px",
    },
    tableSubmissionCol: {
        width: "100px",
    },
    tableAcceptanceCol: {
        width: "100px",
    },
});

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
