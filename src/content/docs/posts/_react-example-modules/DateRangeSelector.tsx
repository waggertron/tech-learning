"use client";

import { useState } from "react";

type ReportRange = "7d" | "30d" | "90d";

export function DateRangeSelector({
  initialRange,
}: {
  initialRange: ReportRange;
}) {
  const [range, setRange] = useState<ReportRange>(initialRange);
  const options: { label: string; value: ReportRange }[] = [
    { label: "7 days", value: "7d" },
    { label: "30 days", value: "30d" },
    { label: "90 days", value: "90d" },
  ];

  return (
    <fieldset>
      <legend>Date range</legend>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={range === option.value}
          onClick={() => setRange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </fieldset>
  );
}
