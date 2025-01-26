import { createFileRoute } from "@tanstack/react-router";

import { ErrorBox } from "@/error/components/ErrorBox";

const AboutPage: React.FC = () => {
    return (
        <div>
            <h3>About</h3>
        </div>
    );
};

export const Route = createFileRoute("/about")({
    component: AboutPage,
    errorComponent: ErrorBox,
});
