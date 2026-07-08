// @ts-nocheck
// app/account/layout.tsx
import type { ReactNode } from "react";

export default function AccountLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section>
      <nav aria-label="Account">
        <a href="/account/profile">Profile</a>
        <a href="/account/billing">Billing</a>
      </nav>
      {children}
    </section>
  );
}
