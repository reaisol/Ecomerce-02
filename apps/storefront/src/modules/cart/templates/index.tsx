"use client"

import { useCart } from "@lib/cart/cart-store"
import CartItem from "@modules/cart/components/cart-item"
import CartSummary from "@modules/cart/components/cart-summary"
import EmptyCart from "@modules/cart/components/empty-cart"
import SkeletonCartPage from "@modules/skeletons/templates/skeleton-cart-page"

const CartTemplate = () => {
  const { lines, totals, isReady } = useCart()

  if (!isReady) return <SkeletonCartPage />

  if (!lines.length) {
    return (
      <div className="bg-surface-muted py-12 small:py-20">
        <div className="content-container">
          <EmptyCart />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-muted py-8 small:py-12" data-testid="cart-container">
      <div className="content-container">
        <h1 className="font-display text-2xl font-bold text-navy-900 small:text-3xl">
          Shopping cart
          <span className="ml-2 text-base font-medium text-grey-50">
            ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 small:grid-cols-[minmax(0,1fr)_380px] small:gap-8">
          <section
            className="rounded-2xl border border-grey-10 bg-white px-4 shadow-card xsmall:px-6"
            aria-label="Items in your cart"
          >
            <ul className="divide-y divide-grey-10">
              {lines.map((line) => (
                <CartItem key={line.id} line={line} />
              ))}
            </ul>
          </section>
          <div className="small:sticky small:top-24">
            <CartSummary totals={totals} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartTemplate
