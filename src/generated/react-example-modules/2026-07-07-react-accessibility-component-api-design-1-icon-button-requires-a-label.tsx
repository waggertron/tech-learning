// @ts-nocheck
import type { ReactNode } from "react";

type IconButtonProps = {
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

export function IconButton({ label, icon, onClick }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} onClick={onClick}>
      {icon}
    </button>
  );
}
