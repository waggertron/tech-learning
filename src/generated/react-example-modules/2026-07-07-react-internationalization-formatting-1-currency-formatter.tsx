// @ts-nocheck
import type { ReactElement } from "react";

export function Price({
  cents,
  currency,
  locale,
}: {
  cents: number;
  currency: string;
  locale: string;
}): ReactElement {
  const amount = cents / 100;
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

  return <span>{formatted}</span>;
}
