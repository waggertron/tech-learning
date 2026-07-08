// @ts-nocheck
import { useMemo, useState } from "react";
import { runExpensiveFilter } from "../../content/docs/posts/_react-example-modules/performance";
import { ReportTable } from "../../content/docs/posts/_react-example-modules/ReportTable";

export function FilteredReport({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");

  const visibleRows = useMemo(() => {
    return runExpensiveFilter(rows, query);
  }, [rows, query]);

  return (
    <>
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
      <ReportTable rows={visibleRows} />
    </>
  );
}
