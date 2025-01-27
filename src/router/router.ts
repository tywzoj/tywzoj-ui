import { createRouter } from "@tanstack/react-router";

import { queryClient } from "@/common/utils/query";
import { store } from "@/store/store";

import { routeTree } from "./routeTree.gen"; // generated route tree

declare module "@tanstack/react-router" {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Register {
        router: typeof router;
    }
}

export const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: {
        queryClient,
        store,
        recaptchaAsync: async () => "", // will be replaced by the actual recaptcha hook
    },
});
