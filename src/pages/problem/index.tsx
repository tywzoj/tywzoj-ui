import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

import { ErrorPageLazy } from "@/components/ErrorPage.lazy";

const ProblemListPage: React.FC = () => {
    return null;
};

export const Route = createFileRoute("/problem/")({
    component: ProblemListPage,
    errorComponent: ErrorPageLazy,
});
