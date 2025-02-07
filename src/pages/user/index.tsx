import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/user/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <div>TODO</div>;
}
