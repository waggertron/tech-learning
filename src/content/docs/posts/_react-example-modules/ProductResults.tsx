export function ProductResults({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  return <p>Showing page {page} for {query || "all products"}</p>;
}
