import type { ILinkWithRouterProps } from "@/components/LinkWithRouter";
import type { CE_Strings } from "@/locales/types";

export type IErrorLink = {
    title: string;
} & ILinkWithRouterProps;

export type IStringCodeErrorLink = {
    string: CE_Strings;
} & ILinkWithRouterProps;
