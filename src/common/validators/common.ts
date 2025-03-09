import { z } from "zod";

import { CE_Order } from "@/server/common/enums";

export const Z_EMPTY_STRING = z.string().length(0);

export const Z_ORDER = z.enum([CE_Order.ASC, CE_Order.DESC]);
export const Z_PAGE = z.coerce.number().int().positive();

export const Z_ID = z.coerce.number().int().nonnegative();
