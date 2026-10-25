import type { Product } from "@lib/catalog/types"
import { clx } from "@modules/common/components/ui"
import ProductCard from "@modules/products/components/product-card"

type ProductGridProps = {
  products: Product[]
  /** "wide" fills a full-width page (up to 5 columns); "default" suits layouts with a sidebar. */
  columns?: "default" | "wide"
  priorityCount?: number
  className?: string
}

const ProductGrid = ({
  products,
  columns = "default",
  priorityCount = 0,
  className,
}: ProductGridProps) => (
  <ul
    className={clx(
      "grid grid-cols-2 gap-3 xsmall:gap-4 small:gap-5",
      columns === "wide"
        ? "small:grid-cols-4 large:grid-cols-5"
        : "small:grid-cols-3 large:grid-cols-4",
      className
    )}
    data-testid="products-list"
  >
    {products.map((product, index) => (
      <li key={product.id}>
        <ProductCard product={product} priority={index < priorityCount} />
      </li>
    ))}
  </ul>
)

export default ProductGrid
