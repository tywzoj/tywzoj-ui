export const enum CE_Order {
    ASC = "ASC",
    DESC = "DESC",
}

export interface IListRequest<ISortBy extends string> {
    order: CE_Order;
    skipCount: number;
    takeCount: number;
    sortBy: ISortBy;
}

export interface ICommonIdRequestParam {
    id: number;
}
