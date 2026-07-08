// @ts-nocheck
import type { ReactNode } from "react";

type AccountLayoutProps = {
  children: ReactNode;
};

export function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <section className="account-layout">
      <nav aria-label="Account settings">
        <a href="/account/profile">Profile</a>
        <a href="/account/security">Security</a>
      </nav>
      <main>{children}</main>
    </section>
  );
}
