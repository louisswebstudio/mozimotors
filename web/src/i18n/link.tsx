"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "./client";

/**
 * Drop-in replacement for next/link that keeps the visitor in their language:
 * `href="/acheter"` becomes `/en/acheter` on the English site. External and `#anchor` hrefs pass through.
 */
export default function Link({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const { href: localize } = useI18n();
  return <NextLink href={typeof href === "string" ? localize(href) : href} {...rest} />;
}
