---
title: "Modern React 39: Internationalization and formatting"
description: "Internationalization and formatting for dates, numbers, currency, and text that cannot stay hard-coded."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-internationalization-formatting/
series:
  slug: modern-react-development
  order: 39
---

This is part 39 of the [Modern React development series](../series/modern-react-development/).

Internationalization starts when UI stops assuming one language, date shape, number format, currency, plural rule, and text direction. React renders whatever strings and formatted values you give it, so formatting needs a clear home.

## Concept

Internationalization, often shortened to i18n, is the work of making software adaptable to different languages and regions. Localization, often shortened to l10n, is the specific translation and regional formatting for one locale.

## Terms

- **i18n**: Internationalization, a numeronym where 18 stands for the letters between i and n.
- **l10n**: Localization, adapting text and formats for one locale.
- **Locale**: A language and regional preference such as `en-US` or `fr-CA`.
- **Formatter**: A function or object that turns values into locale-aware display text.

## Mental model

Think of locale as a lens over display values. Store facts as data, then format them through the user's lens at the edge where text appears.

## How it is used

Use internationalization for dates, times, currencies, numbers, names, addresses, plural text, translated labels, route metadata, validation messages, and content that will be read by users in different locales.

## How to use it

1. Keep raw facts in stable machine formats, such as ISO date strings, numbers, and currency codes.
2. Choose a locale source from route, user preference, browser preference, or account settings.
3. Format values close to display with `Intl` or the project's i18n library.
4. Keep translated message keys stable and meaningful.
5. Test long text, missing translations, right-to-left layouts, and plural cases.

## Example: Currency formatter

```tsx
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
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-internationalization-formatting-1-currency-formatter" role="region" aria-label="Output view: Currency formatter">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Currency formatter.</strong> <code>Price</code> renders <code>&lt;span&gt;</code> markup.</p>
  </div>
</div>

The component receives facts and locale context, then formats at the display boundary.

## Example: Date formatter

```tsx
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
```

<div class="react-example-output not-content" data-react-example-output="2026-07-07-react-internationalization-formatting-2-date-formatter" role="region" aria-label="Output view: Date formatter">
  <div class="react-example-output__header">Output view</div>
  <div class="react-example-output__body">
    <p><strong>Date formatter.</strong> <code>AppointmentTime</code> renders <code>&lt;time&gt;</code> markup.</p>
  </div>
</div>

`dateTime` preserves the machine-readable value while the visible text follows the locale.

## Details to watch

- **Raw values**: Do not store already formatted currency or dates as the source of truth.
- **Text length**: Translated strings can be much longer than English.
- **Plural rules**: Pluralization is locale-specific. Avoid hand-built English-only suffix logic.
- **Server and client**: Keep locale selection consistent across server rendering and hydration.

## Series navigation

- Previous: [Part 38: Auth, roles, and protected UI](../2026-07-07-react-auth-roles-protected-ui/)
- Next: [Part 40: Deployment, observability, and feature flags](../2026-07-07-react-deployment-observability-feature-flags/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Next.js Internationalization guide](https://nextjs.org/docs/app/guides/internationalization)
- [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat)
- [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
