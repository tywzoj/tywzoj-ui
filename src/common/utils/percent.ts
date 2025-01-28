export function percent(value: number, total: number, fixed = 2): string {
    if (total === 0) {
        return "0.00%";
    }

    return `${((value / total) * 100).toFixed(fixed)}%`;
}
