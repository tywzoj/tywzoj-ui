import type { ILinkWithRouterProps } from "@/common/components/LinkWithRouter";

export type IErrorLink = {
    title: string;
} & ILinkWithRouterProps;

export type ILocalizedStringFunctionErrorLink = {
    lsFn: (ls: ILocalizedStrings) => string;
} & ILinkWithRouterProps;
