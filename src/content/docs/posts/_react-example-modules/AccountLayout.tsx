import type { ReactNode } from "react";

export function AccountLayout({ children }: { children?: ReactNode }) {
  return (
    <section className="account-layout">
      <nav aria-label="Account settings">
        <a href="/account/profile">Profile</a>
        <a href="/account/security">Security</a>
      </nav>
      <main>{children ?? <p>Profile settings</p>}</main>
    </section>
  );
}
