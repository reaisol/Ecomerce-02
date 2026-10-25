import type { Product, ProductVariant } from "@lib/catalog/types"

import type { CartLine } from "./types"

export function toCartLine(
  product: Product,
  variant: ProductVariant
): Omit<CartLine, "quantity"> {
  return {
    id: variant.id,
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image: product.thumbnail?.url,
    sku: variant.sku,
    options: variant.options,
    unitPrice: variant.price,
    compareAtPrice: variant.compareAtPrice,
    maxQuantity: variant.stock,
  }
}
