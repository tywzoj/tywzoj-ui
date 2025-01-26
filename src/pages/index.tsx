import { createFileRoute } from "@tanstack/react-router";

import { ErrorBox } from "@/error/components/ErrorBox";

const HomePage: React.FC = () => {
    return (
        <div>
            <h3>Home</h3>
        </div>
    );
};

export const Route = createFileRoute("/")({
    component: HomePage,
    errorComponent: ErrorBox,
});
