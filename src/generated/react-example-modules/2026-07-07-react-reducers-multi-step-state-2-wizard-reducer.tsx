// @ts-nocheck
import { useReducer, type Reducer } from "react";

type WizardState = {
  step: "account" | "profile" | "confirm";
  email: string;
  displayName: string;
};

type WizardAction =
  | { type: "emailChanged"; email: string }
  | { type: "profileSaved"; displayName: string }
  | { type: "back" };

const wizardReducer: Reducer<WizardState, WizardAction> = (state, action) => {
  switch (action.type) {
    case "emailChanged":
      return { ...state, email: action.email };
    case "profileSaved":
      return { ...state, displayName: action.displayName, step: "confirm" };
    case "back":
      return { ...state, step: "account" };
  }
};

const initialWizardState: WizardState = {
  step: "account",
  email: "",
  displayName: "",
};

export function WizardDemo() {
  const [state, dispatch] = useReducer(wizardReducer, initialWizardState);

  return (
    <section aria-label="Signup wizard">
      <p>Step: {state.step}</p>
      <p>Email: {state.email || "Not set"}</p>
      <p>Name: {state.displayName || "Not set"}</p>
      <button
        type="button"
        onClick={() =>
          dispatch({ type: "emailChanged", email: "reader@example.com" })
        }
      >
        Use saved email
      </button>
      <button
        type="button"
        onClick={() =>
          dispatch({ type: "profileSaved", displayName: "Reader" })
        }
      >
        Save profile
      </button>
      <button type="button" onClick={() => dispatch({ type: "back" })}>
        Back
      </button>
    </section>
  );
}
