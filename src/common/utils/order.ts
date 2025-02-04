import { CE_Order } from "@/server/common/types";

import { neverGuard } from "./never-guard";

export function orderToDirection(order: CE_Order): "ascending" | "descending" {
    switch (order) {
        case CE_Order.ASC:
            return "ascending";
        case CE_Order.DESC:
            return "descending";
        default:
            neverGuard(order);
    }
}

export function reverseOrder(order: CE_Order): CE_Order {
    switch (order) {
        case CE_Order.ASC:
            return CE_Order.DESC;
        case CE_Order.DESC:
            return CE_Order.ASC;
        default:
            neverGuard(order);
    }
}
