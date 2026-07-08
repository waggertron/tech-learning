type Filter = "all" | "open" | "done";

export function FilterTabs({
  value,
  onChange,
}: {
  value: Filter;
  onChange: (value: Filter) => void;
}) {
  return (
    <div role="tablist">
      {(["all", "open", "done"] as const).map((filter) => (
        <button
          key={filter}
          aria-pressed={value === filter}
          onClick={() => onChange(filter)}
        >
          {filter === "all" ? "All" : filter === "open" ? "Open" : "Done"}
        </button>
      ))}
    </div>
  );
}
