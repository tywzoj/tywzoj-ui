export function calcCount(page: number, takeCount: number) {
    return {
        skipCount: (page - 1) * takeCount,
        takeCount,
    };
}

export function calcPageCount(count: number, takeCount: number) {
    return Math.ceil(count / takeCount);
}
