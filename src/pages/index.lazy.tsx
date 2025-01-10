import { createLazyFileRoute } from "@tanstack/react-router";

const HomePage: React.FC = () => {
    return (
        <div>
            <h3>Hello World</h3>
        </div>
    );
};

export const Route = createLazyFileRoute("/")({
    component: HomePage,
});
