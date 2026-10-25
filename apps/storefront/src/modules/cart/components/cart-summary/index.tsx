import { ShieldCheck } from "@medusajs/icons"

import type { CartTotals } from "@lib/cart/types"
import FreeShippingProgress from "@modules/cart/components/free-shipping-progress"
import PriceBreakdown from "@modules/cart/components/price-breakdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CartSummary = ({ totals }: { totals: CartTotals }) => (
  <section
    className="rounded-2xl border border-grey-10 bg-white p-5 shadow-card small:p-6"
    aria-labelledby="cart-summary-title"
    data-testid="cart-summary"
  >
    <h2
      id="cart-summary-title"
      className="text-xs font-semibold uppercase tracking-wider text-grey-50"
    >
      Price details
    </h2>
    <PriceBreakdown totals={totals} className="mt-4" />
    <FreeShippingProgress
      amountRemaining={totals.amountToFreeShipping}
      className="mt-4"
    />
    <LocalizedClientLink
      href="/checkout"
      className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-600 text-base font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      data-testid="checkout-button"
    >
      Proceed to checkout
    </LocalizedClientLink>
    <LocalizedClientLink
      href="/store"
      className="mt-3 block text-center text-sm font-medium text-brand-700 hover:underline"
    >
      Continue shopping
    </LocalizedClientLink>
    <p className="mt-5 flex items-center justify-center gap-2 text-xs text-grey-50">
      <ShieldCheck aria-hidden />
      Safe and secure checkout
    </p>
  </section>
)

export default CartSummary
