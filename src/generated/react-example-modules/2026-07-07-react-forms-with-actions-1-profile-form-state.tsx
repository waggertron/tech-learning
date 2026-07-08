// @ts-nocheck
import { useActionState } from "react";
import { updateProfile } from "../../content/docs/posts/_react-example-modules/profileApi";

type ProfileState = {
  message: string;
};

async function saveProfile(
  previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (displayName.length < 2) {
    return { message: "Display name needs at least two characters." };
  }

  await updateProfile({ displayName });
  return { message: "Profile saved." };
}

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(saveProfile, {
    message: "",
  });

  return (
    <form action={formAction}>
      <label>
        Display name
        <input name="displayName" />
      </label>
      <button disabled={isPending}>Save</button>
      <p>{state.message}</p>
    </form>
  );
}
