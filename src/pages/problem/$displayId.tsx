import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

const ProblemDetailPage: React.FC = () => {
    return null;
};

export const Route = createFileRoute("/problem/$displayId")({
    component: ProblemDetailPage,
});
