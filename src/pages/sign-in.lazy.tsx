import { createLazyFileRoute } from "@tanstack/react-router";
import type React from "react";

const SignInPage: React.FC = () => {
    return <div></div>;
};

export const Route = createLazyFileRoute("/sign-in")({
    component: SignInPage,
});
