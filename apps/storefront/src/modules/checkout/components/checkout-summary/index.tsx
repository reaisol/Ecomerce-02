"use client"

import { ChevronDown } from "@medusajs/icons"
import { useState } from "react"

import type { CartLine } from "@lib/cart/types"
import type { OrderTotals } from "@lib/orders/types"
import { formatPrice } from "@lib/util/format-price"
import PriceBreakdown from "@modules/cart/components/price-breakdown"
import { clx } from "@modules/common/components/ui"
import OrderLine from "@modules/order/components/order-line"

type CheckoutSummaryProps = {
  lines: CartLine[]
  totals: OrderTotals
}

/** Always expanded on desktop; collapsible on mobile, where it sits above the form. */
const CheckoutSummary = ({ lines, totals }: CheckoutSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <section
      className="rounded-2xl border border-grey-10 bg-white shadow-card"
      aria-label="Order summary"
      data-testid="checkout-summary"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 p-4 text-left small:hidden"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="checkout-summary-content"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-brand-700">
          {isOpen ? "Hide" : "Show"} order summary
          <ChevronDown
            className={clx("transition-transform", isOpen && "rotate-180")}
            aria-hidden
          />
        </span>
        <span className="text-base font-bold tabular-nums text-navy-900">
          {formatPrice(totals.total)}
        </span>
      </button>

      <div
        id="checkout-summary-content"
        className={clx(
          "border-t border-grey-10 p-4 small:block small:border-t-0 small:p-6",
          !isOpen && "hidden"
        )}
      >
        <h2 className="hidden font-display text-lg font-bold text-navy-900 small:block">
          Order summary
        </h2>
        <ul className="flex flex-col gap-4 small:mt-4">
          {lines.map((line) => (
            <OrderLine key={line.id} line={line} />
          ))}
        </ul>
        <PriceBreakdown
          totals={totals}
          className="mt-5 border-t border-grey-10 pt-5"
        />
      </div>
    </section>
  )
}

export default CheckoutSummary
