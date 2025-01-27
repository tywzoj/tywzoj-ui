import { Button, type ButtonProps } from "@fluentui/react-components";
import type { LinkComponent } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type FluentButtonProps = ButtonProps;

const FluentButtonComponent = React.forwardRef<HTMLAnchorElement, FluentButtonProps>((props, ref) => {
    return <Button as="a" ref={ref} {...props} />;
});
FluentButtonComponent.displayName = "FluentButtonComponent";

const FluentButtonComponentWithRouter = createLink(FluentButtonComponent);

export const ButtonWithRouter: LinkComponent<typeof FluentButtonComponentWithRouter> = (props) => {
    return <FluentButtonComponentWithRouter preload="intent" {...props} />;
};
