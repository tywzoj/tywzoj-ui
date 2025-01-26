import { createFileRoute } from "@tanstack/react-router";

import { ErrorBox } from "@/error/components/ErrorBox";

const SignUpPage: React.FC = () => {
    return <div></div>;
};

export const Route = createFileRoute("/sign-up")({
    component: SignUpPage,
    errorComponent: ErrorBox,
});
