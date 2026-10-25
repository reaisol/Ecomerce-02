import { commerce } from "@lib/brand"
import type { CartTotals } from "@lib/cart/types"

import type { OrderTotals, PaymentMethod } from "./types"

type PaymentMethodInfo = {
  label: string
  description: string
}

export const PAYMENT_METHOD_INFO: Record<PaymentMethod, PaymentMethodInfo> = {
  upi: {
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm or any UPI app",
  },
  card: {
    label: "Credit / Debit card",
    description: "Visa, Mastercard, RuPay and more",
  },
  netbanking: {
    label: "Net banking",
    description: "All major Indian banks",
  },
  cod: {
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives",
  },
}

export const getPaymentFee = (method: PaymentMethod) =>
  method === "cod" ? commerce.codFee : 0

export const withPaymentFee = (
  totals: CartTotals,
  method: PaymentMethod
): OrderTotals => {
  const paymentFee = getPaymentFee(method)
  return { ...totals, paymentFee, total: totals.total + paymentFee }
}
