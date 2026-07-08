// @ts-nocheck
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  danger: "button button-danger",
};

export function Button({
  variant = "primary",
  children,
  onClick,
}: ButtonProps) {
  return (
    <button className={variantClass[variant]} onClick={onClick}>
      {children}
    </button>
  );
}
