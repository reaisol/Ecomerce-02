import type { Product } from "@lib/catalog/types"
import SectionHeading from "@modules/common/components/section-heading"
import ProductCard from "@modules/products/components/product-card"

import { RAIL_ITEM_CLASS } from "./rail-item-class"
import RailScroller from "./rail-scroller"

type ProductRailProps = {
  id: string
  title: string
  subtitle?: string
  action?: { label: string; href: string }
  /** Server loader, so the rail can stream in behind its own Suspense boundary. */
  load: () => Promise<Product[]>
}

const ProductRail = async ({
  id,
  title,
  subtitle,
  action,
  load,
}: ProductRailProps) => {
  const products = await load()

  if (products.length === 0) {
    return null
  }

  return (
    <section
      className="content-container py-8 small:py-10"
      aria-labelledby={id}
    >
      <SectionHeading
        id={id}
        title={title}
        subtitle={subtitle}
        action={action}
      />
      <RailScroller label={title}>
        {products.map((product) => (
          <li key={product.id} className={RAIL_ITEM_CLASS}>
            <ProductCard product={product} />
          </li>
        ))}
      </RailScroller>
    </section>
  )
}

export default ProductRail
