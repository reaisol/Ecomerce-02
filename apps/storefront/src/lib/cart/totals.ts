import { commerce } from "@lib/brand"

import type { CartLine, CartTotals } from "./types"

export function calculateCartTotals(lines: CartLine[]): CartTotals {
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0)
  const mrpTotal = lines.reduce(
    (sum, l) => sum + (l.compareAtPrice ?? l.unitPrice) * l.quantity,
    0
  )
  const qualifiesForFreeShipping = subtotal >= commerce.freeShippingThreshold
  const shipping =
    itemCount === 0 || qualifiesForFreeShipping
      ? 0
      : commerce.standardShippingFee

  return {
    itemCount,
    mrpTotal,
    subtotal,
    savings: mrpTotal - subtotal,
    shipping,
    total: subtotal + shipping,
    amountToFreeShipping: qualifiesForFreeShipping
      ? 0
      : commerce.freeShippingThreshold - subtotal,
  }
}
