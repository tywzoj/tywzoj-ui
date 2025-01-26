import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { ErrorBox } from "@/error/components/ErrorBox";
import NotFoundError from "@/error/components/NotFoundError";
import Layout from "@/layouts/Layout";
import type { IRouterContext } from "@/router/types";

export const Route = createRootRouteWithContext<IRouterContext>()({
    component: () => (
        <Layout>
            <Outlet />
        </Layout>
    ),
    errorComponent: ({ error }) => (
        <div style={{ padding: 20 }}>
            <ErrorBox error={error} />
        </div>
    ),
    notFoundComponent: NotFoundError,
});
