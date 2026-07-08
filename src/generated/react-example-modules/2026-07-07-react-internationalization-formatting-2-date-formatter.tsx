// @ts-nocheck
import type { ReactElement } from "react";

export function AppointmentTime({
  startsAt,
  locale,
}: {
  startsAt: string;
  locale: string;
}): ReactElement {
  const date = new Date(startsAt);
  const formatted = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);

  return <time dateTime={startsAt}>{formatted}</time>;
}
