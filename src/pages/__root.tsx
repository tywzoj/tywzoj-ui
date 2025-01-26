import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { NotFoundErrorLazy } from "@/error/components/NotFoundError.lazy";
import Layout from "@/layouts/Layout";
import type { IRouterContext } from "@/router/types";

export const Route = createRootRouteWithContext<IRouterContext>()({
    component: () => (
        <Layout>
            <Outlet />
        </Layout>
    ),
    notFoundComponent: NotFoundErrorLazy,
});
