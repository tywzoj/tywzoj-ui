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
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import React from "react";
import { z } from "zod";

import { ButtonWithRouter } from "@/common/components/ButtonWithRouter";
import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { PaginationButtons } from "@/common/components/PaginationButtons";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useTableSortAttributes } from "@/common/hooks/table-sort";
import { flex } from "@/common/styles/flex";
import { noUnderlineLinkStyles } from "@/common/styles/link";
import { calcCount, calcPageCount } from "@/common/utils/pagination";
import { percent } from "@/common/utils/percent";
import { Z_ORDER, Z_PROBLEM_SORT_BY } from "@/common/validators/zod";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { ProblemTag } from "@/components/ProblemTag";
import { VisibilityLabel } from "@/components/VisibilityLabel";
import { useLocalizedStrings } from "@/locales/hooks";
import { CE_Strings } from "@/locales/locale";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { ProblemModule } from "@/server/api";
import { CE_Order } from "@/server/common/enums";
import { CE_ProblemSortBy } from "@/server/modules/problem.enums";
import { withThrowErrors } from "@/server/utils";
import { useIsMiddleScreen, usePermission } from "@/store/hooks";
import { getPagination, getPreference } from "@/store/selectors";

const ProblemListPage: React.FC = () => {
    const { keyword } = Route.useLoaderDeps();

    const navigate = Route.useNavigate();
    const search = Route.useSearch();
    const [searchBoxValue, setSearchBoxValue] = React.useState("");
    const permission = usePermission();

    React.useEffect(() => {
        // Update search box value when search param keyword changes
        setSearchBoxValue(keyword ?? "");
    }, [keyword]);

    const ls = useLocalizedStrings({
        $title: CE_Strings.NAVIGATION_PROBLEMS,
        $searchBtn: CE_Strings.COMMON_SEARCH_BUTTON,
        $searchPlc: CE_Strings.PROBLEM_SEARCH_PLACEHOLDER,
        $new: CE_Strings.NAVIGATION_PROBLEM_NEW,
    });

    useSetPageTitle(ls.$title);

    const styles = useStyles();

    const searchProblem = (keyword: string) => navigate({ search: { ...search, k: keyword } });

    return (
        <div className={styles.$root}>
            <div className={styles.$header}>
                <div className={styles.$title}>
                    <Title3 as="h1">{ls.$title}</Title3>
                </div>
                {permission.manageProblem && (
                    <div className={styles.$actions}>
                        <Button>Manage Tags</Button> {/* TODO: add a page */}
                        <ButtonWithRouter appearance="primary" to="/problem/new">
                            {ls.$new}
                        </ButtonWithRouter>
                    </div>
                )}
                <div className={styles.$search}>
                    <SearchBox
                        placeholder={ls.$searchPlc}
                        value={searchBoxValue}
                        onChange={(_, { value }) => {
                            setSearchBoxValue(value);
                            if (!value) {
                                searchProblem(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchProblem(searchBoxValue);
                            }
                        }}
                    />
                    <Button onClick={() => searchProblem(searchBoxValue)}>{ls.$searchBtn}</Button>
                </div>
                {/* TODO: Show tag switch */}
                {/* TODO: Tag filter */}
            </div>
            <React.Suspense
                fallback={
                    <div className={styles.$loading}>
                        <Spinner />
                    </div>
                }
            >
                <ProblemList />
            </React.Suspense>
        </div>
    );
};

const ProblemList: React.FC = () => {
    const { queryOptions, takeCount } = Route.useLoaderData();
    const { sortBy, order, page } = Route.useLoaderDeps();
    const search = Route.useSearch();
    const navigate = Route.useNavigate();

    const { data } = useSuspenseQueryData(queryOptions);

    const problemList = data.problemBasicDetails;
    const pageCount = calcPageCount(data.count, takeCount);

    const isMiddleScreen = useIsMiddleScreen();

    const ls = useLocalizedStrings({
        $colTitle: CE_Strings.TITLE_LABEL,
        $colVisibility: CE_Strings.VISIBILITY_LABEL,
        $colSubmission: CE_Strings.NAVIGATION_SUBMISSIONS,
        $colId: CE_Strings.ID_LABEL,
    });

    const { tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

    const tableSortAttributes = useTableSortAttributes(
        order,
        sortBy,
        (order, sortBy) => navigate({ search: { ...search, o: order, s: sortBy } }) /* onSortChange */,
    );

    const styles = useStyles();

    const onPageChange = (page: number) => navigate({ search: { ...search, p: page } });

    return (
        <>
            <PaginationButtons
                className={styles.$headerPagination}
                page={page}
                pageCount={pageCount}
                onPageChange={onPageChange}
            />
            <div className={styles.$tableContainer}>
                <Table onKeyDown={onTableKeyDown} {...tableTabsterAttribute}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell
                                className={styles.$tableIdCol}
                                {...tableSortAttributes(CE_ProblemSortBy.DisplayId)}
                            >
                                {ls.$colId}
                            </TableHeaderCell>
                            <TableHeaderCell
                                className={styles.$tableTitleCol}
                                {...tableSortAttributes(CE_ProblemSortBy.Title)}
                            >
                                {ls.$colTitle}
                            </TableHeaderCell>
                            <TableHeaderCell className={styles.$tableVisibilityCol}>
                                {ls.$colVisibility}
                            </TableHeaderCell>
                            {!isMiddleScreen && (
                                <>
                                    <TableHeaderCell
                                        className={styles.$tableSubmissionCol}
                                        {...tableSortAttributes(CE_ProblemSortBy.SubmissionCount)}
                                    >
                                        {ls.$colSubmission}
                                    </TableHeaderCell>
                                    <TableHeaderCell className={styles.$tableAcceptanceCol}>Acceptance</TableHeaderCell>
                                </>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {problemList.map((problem) => (
                            <TableRow key={problem.id}>
                                <TableCell>{problem.displayId}</TableCell>
                                <TableCell className={styles.$problemTitleWithTags}>
                                    <LinkWithRouter
                                        className={styles.$problemLink}
                                        tabIndex={0}
                                        to="/problem/$displayId"
                                        params={{ displayId: `${problem.displayId}` }}
                                        preload={false}
                                    >
                                        {problem.title}
                                    </LinkWithRouter>
                                    {problem.tags.length > 0 && (
                                        <div className={styles.$problemTags}>
                                            {problem.tags.map((tag) => (
                                                <ProblemTag key={tag.id} name={tag.name} color={tag.color} />
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
                                            {percent(problem.acceptedSubmissionCount, problem.submissionCount)}
                                        </TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PaginationButtons
                className={styles.$footerPagination}
                page={page}
                pageCount={pageCount}
                onPageChange={onPageChange}
            />
        </>
    );
};

const useStyles = makeStyles({
    $root: {
        ...flex({
            flexDirection: "column",
        }),
        width: "100%",
        boxSizing: "border-box",
        flexGrow: 1,
    },
    $header: {
        ...flex({
            flexDirection: "column",
        }),
        marginBottom: "20px",
        width: "100%",
    },
    $title: {
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
    $search: {
        ...flex({
            flexDirection: "row",
        }),
        gap: "8px",
        ">.fui-Input": {
            flexGrow: 1,
        },
        width: "100%",
    },
    $actions: {
        ...flex({
            justifyContent: "flex-end",
        }),
        width: "100%",
        marginBottom: "20px",
        gap: "8px",
    },
    $loading: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }),
        flexGrow: 1,
    },
    $headerPagination: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        marginBottom: "20px",
    },
    $footerPagination: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
        }),
        marginTop: "20px",
    },
    $tableContainer: {
        padding: "20px",
        boxShadow: tokens.shadow2Brand,
        borderRadius: tokens.borderRadiusSmall,
    },
    $tableIdCol: {
        width: "60px",
    },
    $tableTitleCol: {},
    $tableVisibilityCol: {
        width: "80px",
    },
    $tableSubmissionCol: {
        width: "100px",
    },
    $tableAcceptanceCol: {
        width: "100px",
    },
    $problemLink: {
        ...noUnderlineLinkStyles,
    },
    $problemTitleWithTags: {
        ...flex({
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        }),
        padding: "12px 0",
        gap: "8px",
        height: "max-content",
    },
    $problemTags: {
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

const queryOptionsFn = createQueryOptionsFn(CE_QueryId.ProblemList, withThrowErrors(ProblemModule.getProblemListAsync));

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
    loader: async ({ context: { queryClient, store }, deps: { page, order, sortBy, keyword } }) => {
        const { problem: takeCount } = getPagination(store.getState());
        const { showTagsOnProblemList } = getPreference(store.getState());

        const queryOptions = queryOptionsFn({
            ...calcCount(page, takeCount),
            sortBy,
            order,
            queryTags: showTagsOnProblemList,
            keyword,
            keywordMatchesId: true,
        });

        if (!keyword) {
            await queryClient.ensureQueryData(queryOptions);
        } else {
            queryClient.prefetchQuery(queryOptions);
        }

        return { queryOptions, takeCount };
    },
});
