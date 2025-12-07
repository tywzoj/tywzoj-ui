import { Link, type LinkProps } from "@fluentui/react-components";
import type { LinkComponentProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type FluentLinkProps = Omit<LinkProps, "href">;

const FluentLinkComponent = React.forwardRef<HTMLAnchorElement, FluentLinkProps>((props, ref) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <Link as="a" ref={ref} {...props} />;
});
FluentLinkComponent.displayName = "FluentLinkComponent";

const FluentLinkComponentWithRouter = createLink(FluentLinkComponent);

export type ILinkWithRouterProps = LinkComponentProps<typeof FluentLinkComponentWithRouter>;

export const LinkWithRouter = React.forwardRef<HTMLAnchorElement, ILinkWithRouterProps>((props, ref) => {
    return <FluentLinkComponentWithRouter ref={ref} {...props} />;
});
LinkWithRouter.displayName = "LinkWithRouter";
