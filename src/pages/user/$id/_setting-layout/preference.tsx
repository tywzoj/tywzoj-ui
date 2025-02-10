import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$id/_setting-layout/preference")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO: preference</div>;
}
