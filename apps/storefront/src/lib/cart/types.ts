/**
 * A cart line snapshots the product data needed to render the cart without
 * another catalog lookup. `id` is the variant id, so the same variant added
 * twice merges into one line.
 */
export type CartLine = {
  id: string
  productId: string
  slug: string
  name: string
  image?: string
  sku: string
  /** Option label pairs, e.g. { Color: "Blue" }. Empty for single-variant products. */
  options: Record<string, string>
  unitPrice: number
  compareAtPrice?: number
  quantity: number
  /** Available stock at the time of adding; caps the quantity selector. */
  maxQuantity: number
}

export type CartTotals = {
  itemCount: number
  /** Sum of compare-at (MRP) prices, falling back to the selling price. */
  mrpTotal: number
  subtotal: number
  savings: number
  shipping: number
  total: number
  amountToFreeShipping: number
}
