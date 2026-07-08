// @ts-nocheck
import { updateDisplayName } from "../../content/docs/posts/_react-example-modules/actions";

export function DisplayNameForm() {
  return (
    <form action={updateDisplayName}>
      <label>
        Display name
        <input name="displayName" />
      </label>
      <button>Save</button>
    </form>
  );
}
