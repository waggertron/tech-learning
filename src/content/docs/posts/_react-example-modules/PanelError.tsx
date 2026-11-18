export function PanelError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert">
      <p>Revenue panel could not load.</p>
      <button type="button" onClick={onRetry}>
        Retry revenue panel
      </button>
    </div>
  );
}
