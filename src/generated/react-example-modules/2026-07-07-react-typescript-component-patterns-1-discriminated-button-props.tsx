// @ts-nocheck
import type { ReactNode } from "react";

type ButtonProps =
  | {
      kind: "button";
      onClick: () => void;
      children: ReactNode;
    }
  | {
      kind: "link";
      href: string;
      children: ReactNode;
    };

export function ActionButton(props: ButtonProps) {
  if (props.kind === "link") {
    return <a href={props.href}>{props.children}</a>;
  }

  return <button onClick={props.onClick}>{props.children}</button>;
}
