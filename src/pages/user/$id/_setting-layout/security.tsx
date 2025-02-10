import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$id/_setting-layout/security")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO: security</div>;
}
