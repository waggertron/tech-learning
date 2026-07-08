// @ts-nocheck
import { useState } from "react";

export function HelpDisclosure() {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Shipping details
      </button>
      {open && <p>Orders ship within two business days.</p>}
    </section>
  );
}
