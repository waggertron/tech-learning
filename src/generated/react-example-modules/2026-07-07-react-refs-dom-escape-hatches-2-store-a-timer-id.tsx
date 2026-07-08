// @ts-nocheck
import { useRef } from "react";

export function SaveStatus() {
  const timeoutRef = useRef<number | null>(null);

  function scheduleSavedMessage() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
    }, 1200);
  }

  return <button onClick={scheduleSavedMessage}>Save draft</button>;
}
