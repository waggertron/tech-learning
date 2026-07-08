export function AddToCartButton({ productId }: { productId: string }) {
  return <button data-product-id={productId}>Add to cart</button>;
}
