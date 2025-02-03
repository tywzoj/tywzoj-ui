import {
    Button,
    makeStyles,
    SearchBox,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Title3,
    tokens,
    useTableCompositeNavigation,
} from "@fluentui/react-components";
import { Await, createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import React from "react";
import { z } from "zod";

import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useTableSortAttributes } from "@/common/hooks/table-sort";
import { flex } from "@/common/styles/flex";
import { noUnderlineLinkStyles } from "@/common/styles/link";
import { calcCount, calcPageCount } from "@/common/utils/pagination";
import { percent } from "@/common/utils/percent";
import { Z_ORDER, Z_PROBLEM_SORT_BY } from "@/common/validators/zod";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { PaginationButtons } from "@/components/PaginationButtons";
import { ProblemTag } from "@/components/ProblemTag";
import { VisibilityLabel } from "@/components/VisibilityLabel";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/types";
import { CE_QueryId } from "@/query/id";
import { createQueryOptions } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { CE_Order } from "@/server/common/types";
import { CE_ProblemSortBy } from "@/server/modules/problem.types";
import { withThrowErrors } from "@/server/utils";
import { useIsMiddleScreen } from "@/store/hooks";
import { getPagination, getPreference } from "@/store/selectors";

const ProblemListPage: React.FC = () => {
    const { queryProblemListPromise } = Route.useLoaderData();
    const { sortBy, order, page, keyword } = Route.useLoaderDeps();
    const isMiddleScreen = useIsMiddleScreen();
    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const [searchBoxValue, setSearchBoxValue] = React.useState("");

    React.useEffect(() => {
        // Update search box value when search param keyword changes
        setSearchBoxValue(keyword ?? "");
    }, [keyword]);

    const ls = useLocalizedStrings({
        title: CE_Strings.NAVIGATION_PROBLEMS,
        colTitle: CE_Strings.TITLE_LABEL,
        colVisibility: CE_Strings.VISIBILITY_LABEL,
        colSubmission: CE_Strings.NAVIGATION_SUBMISSIONS,
        colId: CE_Strings.ID_LABEL,
        searchBtn: CE_Strings.COMMON_SEARCH_BUTTON,
        searchPlc: CE_Strings.PROBLEM_SEARCH_PLACEHOLDER,
    });

    useSetPageTitle(ls.title);

    const styles = useStyles();

    const { tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

    const tableSortAttributes = useTableSortAttributes(
        order,
        sortBy,
        (order, sortBy) => navigate({ search: { ...search, o: order, s: sortBy } }) /* onSortChange */,
    );

    const onPageChange = (page: number) => navigate({ search: { ...search, p: page } });
    const searchProblem = (keyword: string) => navigate({ search: { ...search, k: keyword } });

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <Title3 as="h1">{ls.title}</Title3>
                </div>
                <div className={styles.search}>
                    <SearchBox
                        placeholder={ls.searchPlc}
                        value={searchBoxValue}
                        onChange={(_, { value }) => {
                            setSearchBoxValue(value);
                            if (!value) {
                                searchProblem(value);
                            }
                        }}
                        onKeyDown={(e: KeyboardEvent) => {
                            if (e.key === "Enter") {
                                searchProblem(searchBoxValue);
                            }
                        }}
                    />
                    <Button onClick={() => searchProblem(searchBoxValue)}>{ls.searchBtn}</Button>
                </div>
                {/* TODO: Show tag switch */}
                {/* TODO: Add button */}
                {/* TODO: Tag filter */}
            </div>
            <Await
                promise={queryProblemListPromise}
                fallback={
                    <div className={styles.loading}>
                        <Spinner />
                    </div>
                }
            >
                {({ problemList, pageCount }) => (
                    <>
                        <PaginationButtons
                            className={styles.headerPagination}
                            page={page}
                            pageCount={pageCount}
                            onPageChange={onPageChange}
                        />
                        <div className={styles.tableContainer}>
                            <Table onKeyDown={onTableKeyDown} {...tableTabsterAttribute}>
                                <TableHeader>
                                    <TableRow>
                                        <TableHeaderCell
                                            className={styles.tableIdCol}
                                            {...tableSortAttributes(CE_ProblemSortBy.DisplayId)}
                                        >
                                            {ls.colId}
                                        </TableHeaderCell>
                                        <TableHeaderCell
                                            className={styles.tableTitleCol}
                                            {...tableSortAttributes(CE_ProblemSortBy.Title)}
                                        >
                                            {ls.colTitle}
                                        </TableHeaderCell>
                                        <TableHeaderCell className={styles.tableVisibilityCol}>
                                            {ls.colVisibility}
                                        </TableHeaderCell>
                                        {!isMiddleScreen && (
                                            <>
                                                <TableHeaderCell
                                                    className={styles.tableSubmissionCol}
                                                    {...tableSortAttributes(CE_ProblemSortBy.SubmissionCount)}
                                                >
                                                    {ls.colSubmission}
                                                </TableHeaderCell>
                                                <TableHeaderCell className={styles.tableAcceptanceCol}>
                                                    Acceptance
                                                </TableHeaderCell>
                                            </>
                                        )}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {problemList.map((problem) => (
                                        <TableRow key={problem.id}>
                                            <TableCell>{problem.displayId}</TableCell>
                                            <TableCell className={styles.problemTitleWithTags}>
                                                <LinkWithRouter
                                                    className={styles.problemLink}
                                                    tabIndex={0}
                                                    to="/problem/$displayId"
                                                    params={{ displayId: `${problem.displayId}` }}
                                                    preload={false}
                                                >
                                                    {problem.title}
                                                </LinkWithRouter>
                                                {problem.tags.length > 0 && (
                                                    <div className={styles.problemTags}>
                                                        {problem.tags.map((tag) => (
                                                            <ProblemTag
                                                                key={tag.id}
                                                                name={tag.name}
                                                                color={tag.color}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <VisibilityLabel visibility={problem.visibility} />
                                            </TableCell>
                                            {!isMiddleScreen && (
                                                <>
                                                    <TableCell>{problem.submissionCount}</TableCell>
                                                    <TableCell>
                                                        {percent(
                                                            problem.acceptedSubmissionCount,
                                                            problem.submissionCount,
                                                        )}
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <PaginationButtons
                            className={styles.footerPagination}
                            page={page}
                            pageCount={pageCount}
                            onPageChange={onPageChange}
                        />
                    </>
                )}
            </Await>
        </div>
    );
};

const useStyles = makeStyles({
    root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        boxSizing: "border-box",
        flexGrow: 1,
    },
    header: {
        ...flex({
            flexDirection: "column",
        }),
        marginBottom: "20px",
        width: "100%",
    },
    title: {
        ...flex({
            flexDirection: "row",
            justifyContent: "center",
        }),
        width: "100%",
        "> h1": {
            marginTop: "0",
            marginBottom: "20px",
        },
    },
    search: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "8px",
        ">.fui-Input": {
            flexGrow: 1,
        },
        width: "100%",
    },
    loading: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }),
        flexGrow: 1,
    },
    headerPagination: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        marginBottom: "20px",
    },
    footerPagination: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        marginTop: "20px",
    },
    tableContainer: {
        padding: "20px",
        boxShadow: tokens.shadow2Brand,
        borderRadius: tokens.borderRadiusSmall,
    },
    tableIdCol: {
        width: "60px",
    },
    tableTitleCol: {},
    tableVisibilityCol: {
        width: "80px",
    },
    tableSubmissionCol: {
        width: "100px",
    },
    tableAcceptanceCol: {
        width: "100px",
    },
    problemLink: {
        ...noUnderlineLinkStyles,
    },
    problemTitleWithTags: {
        ...flex({
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        }),
        padding: "12px 0",
        gap: "8px",
        height: "max-content",
    },
    problemTags: {
        ...flex({
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
        }),
        gap: "4px",
    },
});

const searchParams = z.object({
    p: fallback(z.number().positive(), 1).default(1), // page
    o: fallback(Z_ORDER, CE_Order.ASC).default(CE_Order.ASC), // order
    s: fallback(Z_PROBLEM_SORT_BY, CE_ProblemSortBy.DisplayId).default(CE_ProblemSortBy.DisplayId), // sortBy
    k: z.coerce.string().optional(), // keyword
});

const queryOptions = createQueryOptions(CE_QueryId.ProblemList, withThrowErrors(ProblemModule.getProblemListAsync));

export const Route = createFileRoute("/problem/")({
    component: ProblemListPage,
    errorComponent: ErrorPageLazy,
    validateSearch: zodValidator(searchParams),
    loaderDeps: ({ search: { p, o, s, k } }) => ({
        page: p,
        order: o,
        sortBy: s,
        keyword: k,
    }),
    loader: ({ context: { queryClient, store }, deps: { page, order, sortBy, keyword } }) => {
        const { problem: takeCount } = getPagination(store.getState());
        const { showTagsOnProblemList } = getPreference(store.getState());

        const queryProblemListPromise = queryClient
            .ensureQueryData(
                queryOptions({
                    ...calcCount(page, takeCount),
                    sortBy,
                    order,
                    queryTags: showTagsOnProblemList,
                    keyword,
                    keywordMatchesId: true,
                }),
            )
            .then((res) => ({
                problemList: res.data.problemBasicDetails,
                pageCount: calcPageCount(res.data.count, takeCount),
            }));

        return { queryProblemListPromise };
    },
});
