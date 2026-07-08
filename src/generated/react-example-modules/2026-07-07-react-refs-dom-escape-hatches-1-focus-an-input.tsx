// @ts-nocheck
import { useRef } from "react";

export function FocusNameButton() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input ref={inputRef} aria-label="Name" />
      <button type="button" onClick={() => inputRef.current?.focus()}>
        Focus name
      </button>
    </>
  );
}
