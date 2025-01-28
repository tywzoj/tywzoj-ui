import { createFileRoute } from "@tanstack/react-router";
import type React from "react";

const ProblemEditPage: React.FC = () => {
    return null;
};

export const Route = createFileRoute("/problem/$id/edit")({
    component: ProblemEditPage,
});
