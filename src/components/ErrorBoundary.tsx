import React from "react";

export class ErrorBoundary extends React.Component<{
    children: React.ReactElement;
}> {
    public static getDerivedStateFromError(error: Error) {
        if (window.onerror) {
            window.onerror(error.message, undefined, undefined, undefined, error);
        }
    }

    public componentDidCatch() {}

    public render() {
        return this.props.children;
    }
}
