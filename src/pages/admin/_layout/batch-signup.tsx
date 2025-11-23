import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/batch-signup")({
    component: RouteComponent,
});

function RouteComponent() {
    // TODO: implement batch sign-up page
    return <div>batch sign-up</div>;
}
