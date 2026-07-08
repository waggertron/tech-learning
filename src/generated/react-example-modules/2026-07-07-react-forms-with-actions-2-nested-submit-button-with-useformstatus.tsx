// @ts-nocheck
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>;
}

export function SettingsForm({ action }: { action: (data: FormData) => void }) {
  return (
    <form action={action}>
      <input name="timezone" />
      <SubmitButton />
    </form>
  );
}
