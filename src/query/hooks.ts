import type { QueryClient, UseSuspenseQueryOptions } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useSuspenseQueryData = <T = unknown>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: UseSuspenseQueryOptions<T, any, any, any>,
    queryClient?: QueryClient,
) => {
    const { data } = useSuspenseQuery<T>(options, queryClient);

    return data;
};
