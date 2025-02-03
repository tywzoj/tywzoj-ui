import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/problem/new")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
