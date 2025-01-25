import { createLazyFileRoute } from "@tanstack/react-router";

const SignUpPage: React.FC = () => {
    return <div></div>;
};

export const Route = createLazyFileRoute("/sign-up")({
    component: SignUpPage,
});
