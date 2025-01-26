import { createFileRoute } from "@tanstack/react-router";

const AboutPage: React.FC = () => {
    return (
        <div>
            <h3>About</h3>
        </div>
    );
};

export const Route = createFileRoute("/about")({
    component: AboutPage,
});
