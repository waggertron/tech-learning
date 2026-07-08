type Tab = "overview" | "activity" | "settings";

export function TabButtons({
  selected,
  onSelect,
}: {
  selected: Tab;
  onSelect: (tab: Tab) => void;
}) {
  return (
    <nav aria-label="Project tabs">
      {(["overview", "activity", "settings"] as const).map((tab) => (
        <button
          key={tab}
          aria-pressed={selected === tab}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}

export function TabPanel({ tab }: { tab: Tab }) {
  return <section>Current tab: {tab}</section>;
}
