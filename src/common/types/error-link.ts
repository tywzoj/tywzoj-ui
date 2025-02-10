import type { ILinkWithRouterProps } from "@/common/components/LinkWithRouter";
import type { CE_Strings } from "@/locales/locale";

export type IErrorLink = {
    title: string;
} & ILinkWithRouterProps;

export type IStringCodeErrorLink = {
    string: CE_Strings;
} & ILinkWithRouterProps;
