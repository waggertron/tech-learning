export function parseProfile(formData: FormData) {
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (displayName.length < 2) {
    return { ok: false, error: "Display name needs at least two characters." };
  }

  return { ok: true, value: { displayName } };
}
