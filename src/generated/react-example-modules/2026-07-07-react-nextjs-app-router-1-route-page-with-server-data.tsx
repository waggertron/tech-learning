// @ts-nocheck
// app/products/[id]/page.tsx
import { AddToCartButton } from "../../content/docs/posts/_react-example-modules/AddToCartButton";
import { getProduct } from "../../content/docs/posts/_react-example-modules/products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main>
      <h1>{product.name}</h1>
      <p>$ {product.price}</p>
      <AddToCartButton productId={product.id} />
    </main>
  );
}
