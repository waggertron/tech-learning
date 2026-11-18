// @ts-nocheck
import { useState } from "react";

type ReleaseEvent = { release: string; variant: "classic" | "new"; name: string };

export function ReleaseDemo({ initialEnabled = false, release = "candidate-2" }: { initialEnabled?: boolean; release?: string }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [events, setEvents] = useState<ReleaseEvent[]>([]);
  const variant = enabled ? "new" : "classic";
  function record(name: string) {
    setEvents((current) => [...current, { release, variant, name }]);
  }
  return (
    <section>
      <label><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /> Enable new checkout</label>
      <h3>{enabled ? "New checkout" : "Classic checkout"}</h3>
      <button type="button" onClick={() => record("checkout-completed")}>Complete simulated checkout</button>
      <button type="button" onClick={() => record("checkout-failed")}>Simulate checkout failure</button>
      <div role="status">
        {events.length === 0 ? <p>No release events yet</p> : <ul>{events.map((event, index) => <li key={index}>{event.release} / {event.variant} / {event.name}</li>)}</ul>}
      </div>
    </section>
  );
}
