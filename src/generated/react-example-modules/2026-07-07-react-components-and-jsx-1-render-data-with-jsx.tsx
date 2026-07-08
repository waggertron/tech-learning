// @ts-nocheck
import type { ReactElement } from "react";

type ProductCardProps = {
  name: string;
  priceCents: number;
  inStock: boolean;
};

export function ProductCard({
  name,
  priceCents,
  inStock,
}: ProductCardProps): ReactElement {
  const price = (priceCents / 100).toFixed(2);

  return (
    <article className="product-card">
      <h2>{name}</h2>
      <p>$ {price}</p>
      {inStock ? <span>In stock</span> : <span>Back soon</span>}
    </article>
  );
}
