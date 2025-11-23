import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/user")({
    component: RouteComponent,
});

function RouteComponent() {
    // TODO: implement users page
    return <div>users</div>;
}
