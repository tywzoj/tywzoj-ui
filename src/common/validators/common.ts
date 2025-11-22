import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

import { CE_Order } from "@/server/common/enums";

export const Z_EMPTY_STRING = z.string().length(0);

export const Z_ORDER = z.enum([CE_Order.ASC, CE_Order.DESC]);
export const Z_PAGE = z.coerce.number().int().positive();
export const Z_LIST_SEARCH_PARAM = z.object({
    p: fallback(Z_PAGE, 1).default(1), // page
    o: fallback(Z_ORDER, CE_Order.ASC).default(CE_Order.ASC), // order
});

export const Z_ID = z.coerce.number().int().nonnegative();
