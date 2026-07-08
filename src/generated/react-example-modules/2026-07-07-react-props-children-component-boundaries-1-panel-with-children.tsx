// @ts-nocheck
import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
};

export function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel" aria-labelledby="panel-title">
      <h2 id="panel-title">{title}</h2>
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function BillingPanel() {
  return (
    <Panel title="Billing">
      <p>Your card is current.</p>
      <button type="button">Update payment method</button>
    </Panel>
  );
}
