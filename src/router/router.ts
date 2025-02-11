import { createRouter } from "@tanstack/react-router";

import { queryClient } from "@/query/client";
import type { IPermission } from "@/server/modules/permission.types";
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
    defaultPreload: false,
    context: {
        queryClient,
        store,
        recaptchaAsync: async () => "", // will be replaced by the actual recaptcha hook
        permission: {} as IPermission, // will be replaced by the actual permission hook
        currentUser: null, // will be replaced by the actual currentUser hook
    },
});
