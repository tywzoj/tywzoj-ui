import { createFileRoute } from "@tanstack/react-router";

import { ErrorPageLazy } from "@/components/ErrorPage.lazy";

const AboutPage: React.FC = () => {
    return (
        <div>
            <h3>About</h3>
        </div>
    );
};

export const Route = createFileRoute("/about")({
    component: AboutPage,
    errorComponent: ErrorPageLazy,
});
