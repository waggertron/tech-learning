type Row = {
  id: string;
  name: string;
};

type RenderTiming = {
  id: string;
  phase: string;
  actualDuration: number;
};

export function runExpensiveFilter(rows: Row[], query: string): Row[] {
  return rows.filter((row) => row.name.toLowerCase().includes(query.toLowerCase()));
}

export function reportRenderTiming(_timing: RenderTiming) {
  return undefined;
}
