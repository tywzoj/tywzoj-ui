/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, queryOptions } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export function createGetQueryOptions<R, P extends any[]>(id: string, fn: (...args: P) => Promise<R>) {
    return (keys: (string | number | boolean)[], ...args: P) =>
        queryOptions({
            queryKey: [id, ...keys] as const,
            queryFn: (): Promise<R> => fn(...args),
        });
}
