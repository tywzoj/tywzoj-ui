import type { ILinkWithRouterProps } from "@/components/LinkWithRouter";
import type { CE_Strings } from "@/locales/types";

import type { IUrlString } from "./url";

export type IErrorLink =
    | ({
          title: string;
      } & Omit<ILinkWithRouterProps, "href">)
    | {
          title: string;
          href: IUrlString;
      };

export type IStringCodeErrorLink =
    | ({
          string: CE_Strings;
      } & Omit<ILinkWithRouterProps, "href">)
    | {
          string: CE_Strings;
          href: IUrlString;
      };
