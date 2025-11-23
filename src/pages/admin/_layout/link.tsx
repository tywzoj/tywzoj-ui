import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/link")({
    component: RouteComponent,
});

function RouteComponent() {
    // TODO: implement link page
    return <div>link</div>;
}
