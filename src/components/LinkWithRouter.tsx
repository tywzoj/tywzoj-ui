import { Link, type LinkProps } from "@fluentui/react-components";
import type { LinkComponent, LinkComponentProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type FluentLinkProps = Omit<LinkProps, "href">;

const FluentLinkComponent = React.forwardRef<HTMLAnchorElement, FluentLinkProps>((props, ref) => {
    return <Link as="a" ref={ref} {...props} />;
});
FluentLinkComponent.displayName = "FluentLinkComponent";

const FluentLinkComponentWithRouter = createLink(FluentLinkComponent);

export type ILinkWithRouterProps = LinkComponentProps<typeof LinkWithRouter>;

export const LinkWithRouter: LinkComponent<typeof FluentLinkComponentWithRouter> = (props) => {
    return <FluentLinkComponentWithRouter preload={false} {...props} />;
};
