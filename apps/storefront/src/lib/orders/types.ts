import type { CartLine, CartTotals } from "@lib/cart/types"

export const PAYMENT_METHODS = ["upi", "card", "netbanking", "cod"] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export type OrderCustomer = {
  fullName: string
  phone: string
  email: string
}

export type OrderAddress = {
  line1: string
  line2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
}

/** Cart totals plus the payment-method fee; `total` includes that fee. */
export type OrderTotals = CartTotals & { paymentFee: number }

export type PlaceOrderInput = {
  customer: OrderCustomer
  shippingAddress: OrderAddress
  paymentMethod: PaymentMethod
  lines: CartLine[]
}

export type Order = {
  id: string
  orderNumber: string
  createdAt: string
  status: "confirmed"
  customer: OrderCustomer
  shippingAddress: OrderAddress
  paymentMethod: PaymentMethod
  lines: CartLine[]
  totals: OrderTotals
  estimatedDelivery: string
}

/** Contract for persisting orders; the local implementation lives in `./order-service`. */
export interface OrderRepository {
  placeOrder(input: PlaceOrderInput): Promise<Order>
  getOrder(id: string): Promise<Order | null>
}
