"use client"

import { ShoppingCart } from "@medusajs/icons"

import { cartActions } from "@lib/cart/cart-store"
import { toCartLine } from "@lib/cart/to-cart-line"
import type { Product } from "@lib/catalog/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const baseClass =
  "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors"

/**
 * Single-variant products go straight into the cart; products with options
 * send the shopper to the detail page to pick a variant first.
 */
const QuickAddButton = ({ product }: { product: Product }) => {
  if (product.stock <= 0) {
    return (
      <span
        className={`${baseClass} cursor-not-allowed bg-surface-subtle text-grey-50`}
      >
        Out of stock
      </span>
    )
  }

  if (product.variants.length > 1) {
    return (
      <LocalizedClientLink
        href={`/products/${product.slug}`}
        className={`${baseClass} border border-brand-200 bg-white text-brand-700 hover:bg-brand-50`}
      >
        Choose options
      </LocalizedClientLink>
    )
  }

  return (
    <button
      type="button"
      onClick={() => cartActions.addItem(toCartLine(product, product.variants[0]))}
      className={`${baseClass} bg-brand-600 text-white hover:bg-brand-700`}
      data-testid="quick-add-button"
    >
      <ShoppingCart />
      Add to cart
    </button>
  )
}

export default QuickAddButton
