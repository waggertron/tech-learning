// @ts-nocheck
import { useState } from "react";
import { ProductList } from "../../content/docs/posts/_react-example-modules/ProductList";

type Product = { id: string; name: string };

export function ProductSearch({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const visible = products.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <SearchField value={query} onChange={setQuery} />
      <ProductList products={visible} />
    </>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      aria-label="Search products"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
