import {
    makeStyles,
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
import * as React from "react";

import { LinkWithRouter } from "@/common/components/LinkWithRouter";
import { PaginationButtons } from "@/common/components/PaginationButtons";
import { useSetPageTitle } from "@/common/hooks/set-page-title";
import { useTableSortAttributes } from "@/common/hooks/table-sort";
import { flex } from "@/common/styles/flex";
import { calcCount, calcPageCount } from "@/common/utils/pagination";
import { Z_LIST_SEARCH_PARAM } from "@/common/validators/common";
import { Z_USER_SORTBY } from "@/common/validators/user";
import { ErrorPageLazy } from "@/components/ErrorPage.lazy";
import { useLocalizedStrings } from "@/locales/hooks";
import { useSuspenseQueryData } from "@/query/hooks";
import { CE_QueryId } from "@/query/id";
import { createQueryOptionsFn } from "@/query/utils";
import { UserModule } from "@/server/api";
import { CE_UserSortBy } from "@/server/modules/user.enums";
import { withThrowErrors } from "@/server/utils";
import { getPagination } from "@/store/selectors";

const UserListPage: React.FC = () => {
    const ls = useLocalizedStrings();
    const styles = useStyles();

    useSetPageTitle(ls.$NAVIGATION_USERS);

    return (
        <div className={styles.$root}>
            <div className={styles.$header}>
                <div className={styles.$title}>
                    <Title3 as="h1">{ls.$NAVIGATION_USERS}</Title3>
                </div>
            </div>
            <React.Suspense
                fallback={
                    <div className={styles.$loading}>
                        <Spinner />
                    </div>
                }
            >
                <UserList />
            </React.Suspense>
        </div>
    );
};

const UserList: React.FC = () => {
    const ls = useLocalizedStrings();
    const { queryOptions, takeCount } = Route.useLoaderData();
    const { sortBy, order, page } = Route.useLoaderDeps();
    const search = Route.useSearch();
    const navigate = Route.useNavigate();
    const {
        data: { userDetails: userList, count: totalCount },
    } = useSuspenseQueryData(queryOptions);
    const pageCount = calcPageCount(totalCount, takeCount);
    const styles = useStyles();

    const { tableTabsterAttribute, onTableKeyDown } = useTableCompositeNavigation();

    const tableSortAttributes = useTableSortAttributes(
        order,
        sortBy,
        (order, sortBy) => navigate({ search: { ...search, o: order, s: sortBy } }) /* onSortChange */,
    );

    return (
        <>
            <div className={styles.$tableContainer}>
                <Table onKeyDown={onTableKeyDown} {...tableTabsterAttribute}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderCell {...tableSortAttributes(CE_UserSortBy.Id)}>{ls.$ID_LABEL}</TableHeaderCell>
                            <TableHeaderCell>{ls.$USERNAME_LABEL}</TableHeaderCell>
                            <TableHeaderCell>{ls.$USER_NICKNAME_LABEL}</TableHeaderCell>
                            <TableHeaderCell {...tableSortAttributes(CE_UserSortBy.AcceptedProblemCount)}>
                                AC Count
                            </TableHeaderCell>
                            <TableHeaderCell {...tableSortAttributes(CE_UserSortBy.Rating)}>Rating</TableHeaderCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userList.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>
                                    <LinkWithRouter
                                        to="/user/$id"
                                        tabIndex={0}
                                        params={{ id: `${user.id}` }}
                                        preload={false}
                                    >
                                        {user.username}
                                    </LinkWithRouter>
                                </TableCell>
                                <TableCell>{user.nickname}</TableCell>
                                <TableCell>{user.acceptedProblemCount}</TableCell>
                                <TableCell>{user.rating}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <PaginationButtons
                className={styles.$pagination}
                page={page}
                pageCount={pageCount}
                onPageChange={(page) => navigate({ search: { ...search, p: page } })}
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
    $loading: {
        ...flex({
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
        }),
        flexGrow: 1,
    },
    $pagination: {
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
});

const searchParams = Z_LIST_SEARCH_PARAM.extend({
    s: fallback(Z_USER_SORTBY, CE_UserSortBy.Id).default(CE_UserSortBy.Id), // sortBy
});

const queryOptionsFn = createQueryOptionsFn(CE_QueryId.UserList, withThrowErrors(UserModule.getUserListAsync));

export const Route = createFileRoute("/user/")({
    component: UserListPage,
    errorComponent: ErrorPageLazy,
    validateSearch: zodValidator(searchParams),
    loaderDeps: ({ search: { p, o, s } }) => ({
        page: p,
        order: o,
        sortBy: s,
    }),
    loader: async ({ context: { queryClient, store }, deps: { page, order, sortBy } }) => {
        const { userList: takeCount } = getPagination(store.getState());

        const queryOptions = queryOptionsFn({
            ...calcCount(page, takeCount),
            sortBy,
            order,
        });

        await queryClient.ensureQueryData(queryOptions);

        return { queryOptions, takeCount };
    },
});
