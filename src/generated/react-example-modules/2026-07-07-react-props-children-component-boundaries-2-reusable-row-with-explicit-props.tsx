// @ts-nocheck
import type { ReactNode } from "react";

type SettingsRowProps = {
  label: string;
  description: string;
  action: ReactNode;
};

export function SettingsRow({ label, description, action }: SettingsRowProps) {
  return (
    <div className="settings-row">
      <div>
        <h3>{label}</h3>
        <p>{description}</p>
      </div>
      <div>{action}</div>
    </div>
  );
}
