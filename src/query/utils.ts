/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryOptions } from "@tanstack/react-query";

import type { CE_QueryId } from "./id";

export function createQueryOptions<R, P extends any[]>(id: CE_QueryId, fn: (...args: P) => Promise<R>) {
    return (...args: P) =>
        queryOptions({
            queryKey: [id, ...args],
            queryFn: (): Promise<R> => fn(...args),
        });
}
