import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/problem/$displayId/files")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
