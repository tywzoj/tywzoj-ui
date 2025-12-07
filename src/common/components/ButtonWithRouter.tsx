import { Button, type ButtonProps } from "@fluentui/react-components";
import type { LinkComponentProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type IFluentButtonProps = Omit<ButtonProps, "href">;

const FluentButtonComponent = React.forwardRef<HTMLAnchorElement, IFluentButtonProps>((props, ref) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Button as="a" ref={ref} {...props} />;
});
FluentButtonComponent.displayName = "FluentButtonComponent";

const FluentButtonComponentWithRouter = createLink(FluentButtonComponent);

export type IButtonWithRouterProps = LinkComponentProps<typeof FluentButtonComponentWithRouter>;

export const ButtonWithRouter = React.forwardRef<HTMLAnchorElement, IButtonWithRouterProps>((props, ref) => {
    return <FluentButtonComponentWithRouter ref={ref} {...props} />;
});
ButtonWithRouter.displayName = "ButtonWithRouter";
