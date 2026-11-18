# Design principles specimen

The TypeScript source is the executable example behind the SOLID and composition lesson. It has no network or package dependency beyond the repository's existing TypeScript toolchain.

Run from the repository root with Node 22.18 or newer (native type stripping):

```bash
node --test companion/design-principles/notifications.test.mjs
node_modules/.bin/tsc --strict --noEmit --types node --target ES2022 --module NodeNext --moduleResolution NodeNext companion/design-principles/notifications.ts
```

The tests prove report selection/order, channel substitution, success/failure auditing, receipt preservation, and rejection of a sender that violates the receipt contract. They do not prove an email provider or durable audit store. A recording callback can itself throw; this minimal wrapper deliberately propagates that failure. Production delivery and durable audit consistency require a separate policy, such as an outbox.
