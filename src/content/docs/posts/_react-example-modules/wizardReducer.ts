export type WizardState = {
  step: "account" | "profile" | "confirm";
  email: string;
  displayName: string;
};

export type WizardAction =
  | { type: "emailChanged"; email: string }
  | { type: "profileSaved"; displayName: string }
  | { type: "back" };

export function wizardReducer(
  state: WizardState,
  action: WizardAction,
): WizardState {
  switch (action.type) {
    case "emailChanged":
      return { ...state, email: action.email };
    case "profileSaved":
      return { ...state, displayName: action.displayName, step: "confirm" };
    case "back":
      return { ...state, step: "account" };
  }
}
