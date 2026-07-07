---
title: "Modern React 7: Reducers for multi-step state"
description: "Reducers for state transitions that need names, invariants, and testable branches."
date: 2026-07-07
tags: [react, typescript, frontend, web]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-07-react-reducers-multi-step-state/
series:
  slug: modern-react-development
  order: 7
---

This is part 7 of the [Modern React development series](../series/modern-react-development/).

Reducers make state transitions readable when a component has several related updates. Instead of spreading update rules across handlers, a reducer names the actions and centralizes how each action changes state.

## Concept

`useReducer` is a React Hook for managing state with a reducer function. The reducer receives the current state and an action object, then returns the next state. For UI state, the reducer should be pure.

## Terms

- **Reducer**: A function that returns next state from current state and an action.
- **Action**: A value that describes what happened, often an object with a `type` field.
- **Dispatch**: The function React gives you to send an action to the reducer.
- **Pure function**: A function that returns a value without changing outside state or performing side effects.

## Mental model

Think of a reducer as a state machine table. Each action name selects one row of rules, and the reducer returns the next snapshot of the machine.

## How it is used

Reducers fit multi-step forms, wizard state, carts, editors, filters with several fields, and components where one event updates several related values. They also make transition rules easier to test as plain functions.

## How to use it

1. Define the state shape as one object.
2. Define action types that describe user or system events.
3. Write a pure reducer that returns a new state for each action.
4. Call `dispatch` from event handlers.
5. Keep network calls, logging, and storage outside the reducer.

## Example: Counter reducer

```tsx
import { useReducer } from "react";

type State = { count: number };
type Action = { type: "increment" } | { type: "reset" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "reset":
      return { count: 0 };
  }
}

export function ReducerCounter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>Add</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </>
  );
}
```

The handler reports intent. The reducer owns the transition rule.

## Example: Wizard reducer

```tsx
type WizardState = {
  step: "account" | "profile" | "confirm";
  email: string;
  displayName: string;
};

type WizardAction =
  | { type: "emailChanged"; email: string }
  | { type: "profileSaved"; displayName: string }
  | { type: "back" };

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "emailChanged":
      return { ...state, email: action.email };
    case "profileSaved":
      return { ...state, displayName: action.displayName, step: "confirm" };
    case "back":
      return { ...state, step: "account" };
  }
}
```

A reducer keeps step movement and data edits in one transition model instead of scattering them across screens.

## Details to watch

- **Purity**: `useReducer` reducers should not fetch, write storage, create timers, or mutate existing state.
- **Action names**: Name actions after what happened, not only after what field changes.
- **State objects**: Return new objects and arrays so React can see that state changed.
- **Scale**: A reducer helps when transitions are related. `useState` is still clearer for one or two independent values.

## Series navigation

- Previous: [Part 6: Lifting state and controlled inputs](../2026-07-07-react-lifting-state-controlled-inputs/)
- Next: [Part 8: Context without global soup](../2026-07-07-react-context-without-global-soup/)
- Series index: [Modern React development](../series/modern-react-development/)

## References

- [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
- [useReducer](https://react.dev/reference/react/useReducer)
- [Components and Hooks must be pure](https://react.dev/reference/rules/components-and-hooks-must-be-pure)

## Related topics

- [Web topics](../../topics/web/)
- [Testing](../../topics/testing/)
