import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/problem/$id/files")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
