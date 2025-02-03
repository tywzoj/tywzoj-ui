import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/problem/$displayId/judge")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
