import type { LinkComponentProps } from "@tanstack/react-router";

export type NavTo<T> = Exclude<LinkComponentProps<T>["to"], undefined>;
