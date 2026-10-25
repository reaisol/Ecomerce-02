"use client"

import { CheckCircleSolid, CreditCard, MapPin, TruckFast } from "@medusajs/icons"
import { useEffect, useState } from "react"

import { commerce } from "@lib/brand"
import { orderService } from "@lib/orders/order-service"
import { PAYMENT_METHOD_INFO } from "@lib/orders/payment-methods"
import type { Order, OrderAddress } from "@lib/orders/types"
import PriceBreakdown from "@modules/cart/components/price-breakdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import OrderLine from "@modules/order/components/order-line"
import SkeletonOrderConfirmed from "@modules/skeletons/templates/skeleton-order-confirmed"

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "ready"; order: Order }

const deliveryDateFormatter = new Intl.DateTimeFormat(commerce.locale, {
  weekday: "long",
  day: "numeric",
  month: "long",
})

const primaryLinkClass =
  "inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-6 text-base font-semibold text-white transition-colors hover:bg-brand-700"
const secondaryLinkClass =
  "inline-flex h-12 items-center justify-center rounded-xl border border-grey-20 bg-white px-6 text-base font-semibold text-navy-900 transition-colors hover:border-brand-300 hover:bg-brand-50"

const OrderConfirmation = ({ orderId }: { orderId: string }) => {
  const [state, setState] = useState<LoadState>({ status: "loading" })

  useEffect(() => {
    let active = true
    orderService.getOrder(orderId).then((order) => {
      if (active) setState(order ? { status: "ready", order } : { status: "not-found" })
    })
    return () => {
      active = false
    }
  }, [orderId])

  if (state.status === "loading") return <SkeletonOrderConfirmed />
  if (state.status === "not-found") return <OrderNotFound />

  const { order } = state

  return (
    <div className="bg-surface-muted py-8 small:py-12" data-testid="order-confirmation">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 xsmall:px-6">
        <header className="rounded-2xl border border-grey-10 bg-white p-6 text-center shadow-card small:p-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600">
            <CheckCircleSolid className="h-8 w-8" aria-hidden />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-900 small:text-3xl">
            Thank you, your order is confirmed
          </h1>
          <p className="mt-2 text-sm text-grey-60">
            Order number{" "}
            <span className="font-semibold text-navy-900" data-testid="order-number">
              {order.orderNumber}
            </span>
          </p>
          <p className="mt-1 break-words text-sm text-grey-60">
            Confirmation sent to{" "}
            <span className="font-medium text-navy-900">{order.customer.email}</span>
          </p>
          <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-left text-sm text-navy-800">
            <TruckFast className="shrink-0 text-brand-600" aria-hidden />
            <span>
              Estimated delivery by{" "}
              <span className="font-semibold">
                {deliveryDateFormatter.format(new Date(order.estimatedDelivery))}
              </span>
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 xsmall:grid-cols-2">
          <InfoCard icon={<MapPin aria-hidden />} title="Delivery address">
            <p className="font-medium text-navy-900">{order.customer.fullName}</p>
            <AddressLines address={order.shippingAddress} />
            <p className="mt-1">+91 {order.customer.phone}</p>
          </InfoCard>
          <InfoCard icon={<CreditCard aria-hidden />} title="Payment method">
            <p className="font-medium text-navy-900">
              {PAYMENT_METHOD_INFO[order.paymentMethod].label}
            </p>
            <p>
              {order.paymentMethod === "cod"
                ? "Please keep the exact amount ready at delivery."
                : "Payment received (demo)."}
            </p>
          </InfoCard>
        </div>

        <section
          className="rounded-2xl border border-grey-10 bg-white p-5 shadow-card small:p-6"
          aria-labelledby="order-items-title"
        >
          <h2 id="order-items-title" className="font-display text-lg font-bold text-navy-900">
            Items in this order
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {order.lines.map((line) => (
              <OrderLine key={line.id} line={line} />
            ))}
          </ul>
          <PriceBreakdown totals={order.totals} className="mt-5 border-t border-grey-10 pt-5" />
        </section>

        <div className="flex flex-col gap-3 xsmall:flex-row xsmall:justify-center">
          <LocalizedClientLink href="/" className={primaryLinkClass}>
            Continue shopping
          </LocalizedClientLink>
          <LocalizedClientLink href="/store" className={secondaryLinkClass}>
            View all products
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) => (
  <section className="rounded-2xl border border-grey-10 bg-white p-5 shadow-card">
    <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-grey-50">
      <span className="text-brand-600">{icon}</span>
      {title}
    </h2>
    <div className="mt-3 text-sm leading-relaxed text-grey-60">{children}</div>
  </section>
)

const AddressLines = ({ address }: { address: OrderAddress }) => (
  <address className="not-italic">
    <p>{address.line1}</p>
    {address.line2 && <p>{address.line2}</p>}
    {address.landmark && <p>Near {address.landmark}</p>}
    <p>
      {address.city}, {address.state} {address.pincode}
    </p>
  </address>
)

const OrderNotFound = () => (
  <div className="bg-surface-muted py-12 small:py-20">
    <div className="mx-auto max-w-md rounded-2xl border border-grey-10 bg-white px-6 py-14 text-center shadow-card">
      <h1 className="font-display text-2xl font-bold text-navy-900">Order not found</h1>
      <p className="mt-2 text-sm text-grey-60">
        We could not find this order on this device. Orders are saved in the
        browser they were placed from.
      </p>
      <LocalizedClientLink href="/store" className={`${primaryLinkClass} mt-8`}>
        Continue shopping
      </LocalizedClientLink>
    </div>
  </div>
)

export default OrderConfirmation
