import { MenuItemLink, type MenuItemLinkProps } from "@fluentui/react-components";
import type { LinkComponent, LinkComponentProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type FluentMenuItemLinkProps = Omit<MenuItemLinkProps, "href">;

const FluentMenuItemLinkComponent = React.forwardRef<HTMLAnchorElement, FluentMenuItemLinkProps>((props, ref) => {
    return <MenuItemLink as="a" ref={ref} {...props} />;
});
FluentMenuItemLinkComponent.displayName = "FluentMenuItemLinkComponent";

const FluentMenuItemLinkComponentWithRouter = createLink(FluentMenuItemLinkComponent);

export type IMenuItemLinkWithRouterProps = LinkComponentProps<typeof MenuItemLinkWithRouter>;

export const MenuItemLinkWithRouter: LinkComponent<typeof FluentMenuItemLinkComponentWithRouter> = (props) => {
    return <FluentMenuItemLinkComponentWithRouter {...props} />;
};
