import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/dashboard")({
    component: RouteComponent,
});

function RouteComponent() {
    // TODO: implement dashboard page
    return <div>dashboard</div>;
}
