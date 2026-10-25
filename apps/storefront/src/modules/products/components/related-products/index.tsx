import type { Category, Product } from "@lib/catalog/types"
import { getRelatedProducts } from "@lib/services/product-service"
import SectionHeading from "@modules/common/components/section-heading"
import ProductCard from "@modules/products/components/product-card"

type RelatedProductsProps = {
  product: Product
  category: Category | null
}

const RelatedProducts = async ({ product, category }: RelatedProductsProps) => {
  const products = await getRelatedProducts(product, 4)

  if (!products.length) return null

  return (
    <section aria-label="Related products" data-testid="related-products">
      <SectionHeading
        title="You may also like"
        subtitle={category ? `More from ${category.name}` : undefined}
        action={
          category
            ? { label: "View all", href: `/categories/${category.slug}` }
            : undefined
        }
      />
      <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 xsmall:gap-4 small:mx-0 small:grid small:grid-cols-4 small:gap-5 small:overflow-visible small:px-0">
        {products.map((related) => (
          <li
            key={related.id}
            className="w-[46%] shrink-0 snap-start xsmall:w-[31%] small:w-auto"
          >
            <ProductCard product={related} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RelatedProducts
