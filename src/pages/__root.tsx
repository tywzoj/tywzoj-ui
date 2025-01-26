import { createRootRouteWithContext } from "@tanstack/react-router";

import { NotFoundPageLazy } from "@/components/NotFoundPage.lazy";
import { RootErrorPageLazy } from "@/components/RootErrorPage.lazy";
import { LayoutLazy } from "@/layouts/Layout.lazy";
import type { IRouterContext } from "@/router/types";

export const Route = createRootRouteWithContext<IRouterContext>()({
    component: LayoutLazy,
    errorComponent: RootErrorPageLazy,
    notFoundComponent: NotFoundPageLazy,
});
