// @ts-nocheck
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
