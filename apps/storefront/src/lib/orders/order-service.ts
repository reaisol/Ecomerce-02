"use client"

import { calculateCartTotals } from "@lib/cart/totals"

import { withPaymentFee } from "./payment-methods"
import type { Order, OrderRepository, PlaceOrderInput } from "./types"

const STORAGE_KEY = "toolshop.orders.v1"
const DELIVERY_DAYS = 4

function readOrders(): Order[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function generateOrderNumber(date: Date) {
  const stamp = date.toISOString().slice(2, 10).replace(/-/g, "")
  const suffix = Math.floor(Math.random() * 90000 + 10000)
  return `TS${stamp}-${suffix}`
}

/**
 * Demo order persistence in the browser. A backend implementation would POST
 * the same `PlaceOrderInput` and return the created `Order`.
 */
class LocalOrderRepository implements OrderRepository {
  async placeOrder(input: PlaceOrderInput): Promise<Order> {
    if (!input.lines.length) {
      throw new Error("Cannot place an order with an empty cart")
    }

    const now = new Date()
    const delivery = new Date(now)
    delivery.setDate(delivery.getDate() + DELIVERY_DAYS)

    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(now),
      createdAt: now.toISOString(),
      status: "confirmed",
      customer: input.customer,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      lines: input.lines,
      totals: withPaymentFee(
        calculateCartTotals(input.lines),
        input.paymentMethod
      ),
      estimatedDelivery: delivery.toISOString(),
    }

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([order, ...readOrders()].slice(0, 20))
      )
    } catch {
      // Without storage the confirmation page cannot reload the order, but placement still succeeds.
    }

    return order
  }

  async getOrder(id: string) {
    return readOrders().find((o) => o.id === id) ?? null
  }
}

export const orderService: OrderRepository = new LocalOrderRepository()
