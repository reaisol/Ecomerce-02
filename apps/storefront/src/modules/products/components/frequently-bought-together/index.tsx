import type { Product } from "@lib/catalog/types"
import { getFrequentlyBoughtTogether } from "@lib/services/product-service"

import BundleBuilder from "./bundle-builder"

const FrequentlyBoughtTogether = async ({ product }: { product: Product }) => {
  const complements = await getFrequentlyBoughtTogether(product)

  if (!complements.length) return null

  return (
    <section
      aria-labelledby="bundle-heading"
      className="rounded-2xl bg-white p-5 shadow-card small:p-7"
      data-testid="frequently-bought-together"
    >
      <h2
        id="bundle-heading"
        className="mb-4 font-display text-lg font-bold text-navy-900 small:text-xl"
      >
        Frequently bought together
      </h2>
      <BundleBuilder product={product} complements={complements} />
    </section>
  )
}

export default FrequentlyBoughtTogether
