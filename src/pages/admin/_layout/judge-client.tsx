import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/judge-client")({
    component: RouteComponent,
});

function RouteComponent() {
    // TODO: implement judge client page
    return <div>judge client</div>;
}
