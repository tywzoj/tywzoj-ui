import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$id/_setting-layout/edit")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO: edit</div>;
}
