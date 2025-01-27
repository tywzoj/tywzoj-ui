export function calcCount(page: number, paginationCount: number) {
    return {
        skipCount: (page - 1) * paginationCount,
        takeCount: paginationCount,
    };
}

export function calcPageCount(count: number, takeCount: number) {
    return Math.ceil(count / takeCount);
}
