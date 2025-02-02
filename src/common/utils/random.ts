export function randomChoice<T>(...arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomPartitionInt(total: number, count: number): number[] {
    const parts = [];
    let remaining = total;

    for (let i = 0; i < count - 1; i++) {
        const part = Math.floor(Math.random() * (remaining - (count - i - 1))) + 1;
        parts.push(part);
        remaining -= part;
    }
    parts.push(remaining);

    return parts;
}

export function randomPartitionIntWithMin(total: number, count: number, minValue: number): number[] {
    if (count * minValue > total) {
        throw new Error(`Cannot partition ${total} into ${count} parts with min value ${minValue}`);
    }

    const remaining = total - count * minValue; // Remaining value after assigning minValue to each part
    const parts = Array(count).fill(minValue); // Initialize all parts with minValue

    const points = new Set<number>();

    // Generate count-1 unique random points within the remaining value
    while (points.size < count - 1) {
        points.add(Math.floor(Math.random() * remaining) + 1);
    }
    const sortedPoints = [...points].sort((a, b) => a - b);

    // Distribute the remaining value based on the sorted random points
    let prev = 0;
    for (let i = 0; i < sortedPoints.length; i++) {
        parts[i] += sortedPoints[i] - prev;
        prev = sortedPoints[i];
    }
    parts[count - 1] += remaining - prev; // Assign the last remaining part

    return parts;
}

export function randomShuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}
