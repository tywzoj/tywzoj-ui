import { createFileRoute } from "@tanstack/react-router";

import { ErrorPageLazy } from "@/components/ErrorPage.lazy";

const SignUpPage: React.FC = () => {
    return <div></div>;
};

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorPageLazy,
});
