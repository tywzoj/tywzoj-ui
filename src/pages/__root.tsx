import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { NotFoundPageLazy } from "@/components/NotFoundPage.lazy";
import { RootErrorPageLazy } from "@/components/RootErrorPage.lazy";
import Layout from "@/layouts/Layout";
import type { IRouterContext } from "@/router/types";

export const Route = createRootRouteWithContext<IRouterContext>()({
    component: () => (
        <Layout>
            <Outlet />
        </Layout>
    ),
    errorComponent: RootErrorPageLazy,
    notFoundComponent: NotFoundPageLazy,
});
