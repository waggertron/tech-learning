// @ts-nocheck
import { useId } from "react";

type TextFieldProps = {
  label: string;
  error?: string;
};

export function TextField({ label, error }: TextFieldProps) {
  const inputId = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p id={errorId}>{error}</p>}
    </div>
  );
}
