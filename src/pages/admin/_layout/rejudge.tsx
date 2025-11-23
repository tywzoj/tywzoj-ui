import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/rejudge")({
    component: RouteComponent,
});

function RouteComponent() {
    // TODO: implement rejudge page
    return <div>Rejudge</div>;
}
