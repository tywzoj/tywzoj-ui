import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/forgot-password")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
