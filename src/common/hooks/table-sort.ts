import type { CE_Order } from "@/server/common/enums";

import { orderToDirection, reverseOrder } from "../utils/order";

interface ITableSortAttributes {
    sortable: true;
    sortDirection?: "ascending" | "descending";
    onClick: () => void;
}

export const useTableSortAttributes = <T extends string>(
    order: CE_Order,
    sortBy: T,
    onSortChange: (order: CE_Order, sortBy: T) => void,
) => {
    return (column: T): ITableSortAttributes => {
        return {
            sortable: true,
            sortDirection: column === sortBy ? orderToDirection(order) : undefined,
            onClick: () => onSortChange(column === sortBy ? reverseOrder(order) : order, column),
        };
    };
};
