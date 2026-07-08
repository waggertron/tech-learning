// @ts-nocheck
import { Outlet } from "react-router";

export default function AccountLayout() {
  return (
    <section>
      <nav aria-label="Account">
        <a href="/account/profile">Profile</a>
        <a href="/account/security">Security</a>
      </nav>
      <Outlet />
    </section>
  );
}
