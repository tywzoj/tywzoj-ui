import { MenuItemLink, type MenuItemLinkProps } from "@fluentui/react-components";
import type { LinkComponentProps } from "@tanstack/react-router";
import { createLink } from "@tanstack/react-router";
import React from "react";

type FluentMenuItemLinkProps = Omit<MenuItemLinkProps, "href">;

const FluentMenuItemLinkComponent = React.forwardRef<HTMLAnchorElement, FluentMenuItemLinkProps>((props, ref) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <MenuItemLink as="a" ref={ref} {...props} />;
});
FluentMenuItemLinkComponent.displayName = "FluentMenuItemLinkComponent";

const FluentMenuItemLinkComponentWithRouter = createLink(FluentMenuItemLinkComponent);

export type IMenuItemLinkWithRouterProps = LinkComponentProps<typeof FluentMenuItemLinkComponentWithRouter>;

export const MenuItemLinkWithRouter = React.forwardRef<
    React.ForwardedRef<HTMLAnchorElement>,
    IMenuItemLinkWithRouterProps
>((props, ref) => {
    return <FluentMenuItemLinkComponentWithRouter ref={ref} {...props} />;
});
MenuItemLinkWithRouter.displayName = "MenuItemLinkWithRouter";
