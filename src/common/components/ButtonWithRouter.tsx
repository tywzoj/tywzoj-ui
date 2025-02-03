import { Button, type ButtonProps } from "@fluentui/react-components";
import type { LinkComponent, LinkComponentProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type IFluentButtonProps = Omit<ButtonProps, "href">;

const FluentButtonComponent = React.forwardRef<HTMLAnchorElement, IFluentButtonProps>((props, ref) => {
    return <Button as="a" ref={ref} {...props} />;
});
FluentButtonComponent.displayName = "FluentButtonComponent";

const FluentButtonComponentWithRouter = createLink(FluentButtonComponent);

export type IButtonWithRouterProps = LinkComponentProps<typeof ButtonWithRouter>;

export const ButtonWithRouter: LinkComponent<typeof FluentButtonComponentWithRouter> = (props) => {
    return <FluentButtonComponentWithRouter {...props} />;
};
