import { createRootRouteWithContext } from "@tanstack/react-router";

import { NotFoundErrorLazy } from "@/error/components/NotFoundError.lazy";
import { LayoutLazy } from "@/layouts/Layout-2.lazy";
import type { IRouterContext } from "@/router/types";

export const Route = createRootRouteWithContext<IRouterContext>()({
    component: LayoutLazy,
    notFoundComponent: NotFoundErrorLazy,
});
