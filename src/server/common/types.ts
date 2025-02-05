import type { CE_Order } from "./enums";

export interface IListRequest<ISortBy extends string> {
    order: CE_Order;
    skipCount: number;
    takeCount: number;
    sortBy: ISortBy;
}

export interface ICommonIdRequestParam {
    id: number;
}
