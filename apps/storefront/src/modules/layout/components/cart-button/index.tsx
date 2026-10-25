"use client"

import { ShoppingCart } from "@medusajs/icons"
import Link from "next/link"
import type { MouseEvent } from "react"

import { useCart } from "@lib/cart/cart-store"
import { useCountryCode } from "@lib/hooks/use-country-code"

/** Opens the cart drawer; falls back to the cart page when JavaScript has not loaded yet. */
const CartButton = () => {
  const { totals, isReady, openDrawer } = useCart()
  const countryCode = useCountryCode()
  const count = isReady ? totals.itemCount : 0

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    openDrawer()
  }

  return (
    <Link
      href={`/${countryCode}/cart`}
      onClick={handleClick}
      aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      className="relative flex h-11 items-center gap-2 rounded-xl px-2.5 text-navy-900 transition-colors hover:bg-brand-50 hover:text-brand-700 small:px-3"
      data-testid="nav-cart-link"
    >
      <span className="relative">
        <ShoppingCart className="h-6 w-6" />
        {count > 0 && (
          <span
            className="absolute -right-2.5 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white"
            data-testid="cart-count"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
      <span className="hidden text-sm font-semibold small:inline">Cart</span>
    </Link>
  )
}

export default CartButton
