import { NavItem, type NavItemProps } from "@fluentui/react-nav-preview";
import type { LinkComponent } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type FluentNavLinkItemProps = Omit<NavItemProps, "href">;

const FluentNavLinkItemComponent = React.forwardRef<HTMLAnchorElement, FluentNavLinkItemProps>((props, ref) => {
    return <NavItem as="a" ref={ref} {...props} />;
});
FluentNavLinkItemComponent.displayName = "FluentNavLinkItemComponent";

const FluentNavLinkItemComponentWithRouter = createLink(FluentNavLinkItemComponent);

export const NavItemWithRouter: LinkComponent<typeof FluentNavLinkItemComponentWithRouter> = (props) => {
    return <FluentNavLinkItemComponentWithRouter preload={false} {...props} />;
};
