import type { ILinkWithRouterProps } from "@/components/LinkWithRouter";

import type { IUrlString } from "./url";

export type IErrorLink =
    | ({
          title: string;
      } & Omit<ILinkWithRouterProps, "href">)
    | {
          title: string;
          href: IUrlString;
      };
