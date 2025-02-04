import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

function RouteComponent() {
    return <div>TODO</div>;
}

const searchParams = z.object({
    pid: z.number().positive().optional(), // problem id
});

export const Route = createFileRoute("/submission/")({
    component: RouteComponent,
    validateSearch: zodValidator(searchParams),
});
