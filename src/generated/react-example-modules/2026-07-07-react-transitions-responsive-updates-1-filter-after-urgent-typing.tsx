// @ts-nocheck
import { useState, useTransition } from "react";
import { ResultGrid } from "../../content/docs/posts/_react-example-modules/ResultGrid";

export function SearchableGrid({ items }: { items: string[] }) {
  const [query, setQuery] = useState("");
  const [visibleQuery, setVisibleQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextQuery: string) {
    setQuery(nextQuery);
    startTransition(() => {
      setVisibleQuery(nextQuery);
    });
  }

  const visible = items.filter((item) => item.includes(visibleQuery));

  return (
    <>
      <input value={query} onChange={(event) => handleChange(event.target.value)} />
      {isPending && <p>Updating results...</p>}
      <ResultGrid items={visible} />
    </>
  );
}
