export type Row = { id: string; name: string; text: string };
export type RenderTiming = {
  id: string;
  phase: string;
  actualDuration: number;
};

export function createReportRows(count = 12000): Row[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `report-${index}`,
    name: `${index % 2 === 0 ? "North" : "South"} region report ${index}`,
    text: `Revenue retention conversion operations report ${index} `.repeat(16),
  }));
}

export function runExpensiveFilter(rows: Row[], query: string): Row[] {
  const needle = query.toLowerCase();
  return rows.filter((row) => {
    // Deliberate CPU work makes this lesson's repeated derivation measurable.
    const searchable = `${row.name} ${row.text}`
      .normalize("NFKD")
      .toLowerCase();
    return searchable.includes(needle);
  });
}

export function reportRenderTiming(timing: RenderTiming): string {
  return `${timing.id} ${timing.phase}: ${timing.actualDuration.toFixed(2)} ms`;
}
