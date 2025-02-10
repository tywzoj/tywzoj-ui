import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/$id/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>User</div>;
}
