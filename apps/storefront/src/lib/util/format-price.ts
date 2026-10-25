import { commerce } from "@lib/brand"

const rupeeFormatter = new Intl.NumberFormat(commerce.locale, {
  style: "currency",
  currency: commerce.currency,
  maximumFractionDigits: 0,
})

/** Formats whole rupees with Indian digit grouping, e.g. 12499 → "₹12,499". */
export const formatPrice = (amount: number) => rupeeFormatter.format(amount)

export const getDiscountPercent = (price: number, compareAtPrice?: number) =>
  compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0
