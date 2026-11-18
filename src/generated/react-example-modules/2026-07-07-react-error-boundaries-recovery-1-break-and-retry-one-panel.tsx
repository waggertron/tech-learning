// @ts-nocheck
import { useState } from "react";
import { ErrorBoundary } from "../../content/docs/posts/_react-example-modules/ErrorBoundary";
import { PanelError } from "../../content/docs/posts/_react-example-modules/PanelError";

function Revenue({ broken }: { broken: boolean }) {
  if (broken) throw new Error("Simulated render failure");
  return <p>Revenue loaded</p>;
}

export function RecoveryDemo() {
  const [broken, setBroken] = useState(false);
  const [lastError, setLastError] = useState("No caught errors");
  return (
    <section>
      <button type="button" onClick={() => setBroken(true)}>Break revenue panel</button>
      <ErrorBoundary
        onReset={() => setBroken(false)}
        onError={(error) => setLastError(`Caught: ${error.message}`)}
        fallback={(reset) => <PanelError onRetry={reset} />}
      >
        <Revenue broken={broken} />
      </ErrorBoundary>
      <p>Activity remains available</p>
      <p role="status">{lastError}</p>
    </section>
  );
}
