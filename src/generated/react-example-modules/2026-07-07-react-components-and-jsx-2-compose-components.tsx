// @ts-nocheck
import { ProductCard } from "../../content/docs/posts/_react-example-modules/ProductCard";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  inStock: boolean;
};

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="featured-products">
      <h2 id="featured-products">Featured products</h2>
      <div className="grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
