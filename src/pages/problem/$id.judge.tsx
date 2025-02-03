import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/problem/$id/judge")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
