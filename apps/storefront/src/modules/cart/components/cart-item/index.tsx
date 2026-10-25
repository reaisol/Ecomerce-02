"use client"

import { Trash } from "@medusajs/icons"

import { cartActions } from "@lib/cart/cart-store"
import { formatLineOptions } from "@lib/cart/format-line-options"
import type { CartLine } from "@lib/cart/types"
import { formatPrice } from "@lib/util/format-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImage from "@modules/common/components/product-image"
import QuantitySelector from "@modules/common/components/quantity-selector"
import { clx } from "@modules/common/components/ui"
import PriceDisplay from "@modules/products/components/price-display"

type CartItemProps = {
  line: CartLine
  /** "compact" for the drawer, "full" for the cart page. */
  size?: "compact" | "full"
}

const CartItem = ({ line, size = "full" }: CartItemProps) => {
  const isCompact = size === "compact"
  const optionsText = formatLineOptions(line.options)
  const productHref = `/products/${line.slug}`

  return (
    <li
      className={clx("flex", isCompact ? "gap-3 py-4" : "gap-4 py-5")}
      data-testid="cart-item"
    >
      <LocalizedClientLink
        href={productHref}
        className={clx(
          "relative shrink-0 overflow-hidden rounded-xl border border-grey-10 bg-surface-subtle",
          isCompact ? "h-20 w-20" : "h-24 w-24 xsmall:h-28 xsmall:w-28"
        )}
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage src={line.image} alt={line.name} sizes="112px" />
      </LocalizedClientLink>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <LocalizedClientLink
              href={productHref}
              className={clx(
                "line-clamp-2 font-medium text-navy-900 hover:text-brand-700",
                isCompact ? "text-sm" : "text-base"
              )}
              data-testid="cart-item-name"
            >
              {line.name}
            </LocalizedClientLink>
            {optionsText && (
              <p className="mt-0.5 truncate text-xs text-grey-50">
                {optionsText}
              </p>
            )}
          </div>
          {!isCompact && (
            <p className="hidden shrink-0 text-base font-bold text-navy-900 tabular-nums xsmall:block">
              {formatPrice(line.unitPrice * line.quantity)}
            </p>
          )}
        </div>

        <PriceDisplay
          price={line.unitPrice}
          compareAtPrice={line.compareAtPrice}
          size="sm"
          className="mt-1"
        />

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <QuantitySelector
            value={line.quantity}
            max={line.maxQuantity}
            size="sm"
            onChange={(quantity) =>
              cartActions.updateQuantity(line.id, quantity)
            }
          />
          <button
            type="button"
            onClick={() => cartActions.removeItem(line.id)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-grey-60 transition-colors hover:bg-danger-50 hover:text-danger-600"
            aria-label={`Remove ${line.name} from cart`}
            data-testid="cart-item-remove"
          >
            <Trash aria-hidden />
            {!isCompact && <span>Remove</span>}
          </button>
        </div>
      </div>
    </li>
  )
}

export default CartItem
