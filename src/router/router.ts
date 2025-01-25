import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { routeTree } from "@/routeTree.gen"; // generated route tree
import { store } from "@/store/store";

declare module "@tanstack/react-router" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        router: typeof router;
    }
}

export const queryClient = new QueryClient();

export const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: { queryClient, store },
});
