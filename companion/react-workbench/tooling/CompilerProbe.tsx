import type { Row } from "../../../src/content/docs/posts/_react-example-modules/performance";

export function CompilerProbe({ rows, query }: { rows: Row[]; query: string }) {
  const matches = rows.filter((row) => row.name.includes(query));
  return <p>{matches.length} matching reports</p>;
}
