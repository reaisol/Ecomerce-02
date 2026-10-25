import { ArrowPath, CreditCard, Phone, TruckFast } from "@medusajs/icons"
import type { ReactNode } from "react"

import { brand, commerce } from "@lib/brand"
import { PAYMENT_METHOD_INFO } from "@lib/orders/payment-methods"
import { PAYMENT_METHODS } from "@lib/orders/types"
import { formatPrice } from "@lib/util/format-price"
import {
  DELIVERY_WINDOW,
  DISPATCH_WINDOW,
  RETURN_WINDOW_DAYS,
} from "@modules/help/lib/policies"

const HelpTemplate = () => (
  <div className="content-container py-8 small:py-12">
    <header className="mb-8 max-w-2xl small:mb-10">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-600">
        Help centre
      </p>
      <h1 className="font-display text-3xl font-extrabold text-navy-900 small:text-4xl">
        How can we help?
      </h1>
      <p className="mt-3 text-grey-60">
        Everything you need to know about delivery, returns and payments at{" "}
        {brand.name}.
      </p>
    </header>

    <div className="grid gap-5 small:grid-cols-2">
      <HelpSection
        id="shipping"
        icon={<TruckFast />}
        title="Shipping & delivery"
      >
        <li>
          Free delivery on orders of{" "}
          {formatPrice(commerce.freeShippingThreshold)} or more. Smaller orders
          have a flat {formatPrice(commerce.standardShippingFee)} delivery fee.
        </li>
        <li>Orders are packed and dispatched {DISPATCH_WINDOW}.</li>
        <li>Most orders arrive in {DELIVERY_WINDOW} anywhere in India.</li>
        <li>You can see your order status any time from your account.</li>
      </HelpSection>

      <HelpSection id="returns" icon={<ArrowPath />} title="Returns & refunds">
        <li>
          Changed your mind? Return unused items in their original packaging
          within {RETURN_WINDOW_DAYS} days of delivery.
        </li>
        <li>
          Damaged or wrong item? Tell us within 48 hours and we will replace it
          free.
        </li>
        <li>
          Refunds go back to your original payment method within 5–7 business
          days of the return being picked up.
        </li>
      </HelpSection>

      <HelpSection id="payments" icon={<CreditCard />} title="Payments">
        {PAYMENT_METHODS.map((method) => (
          <li key={method}>
            <span className="font-semibold text-navy-900">
              {PAYMENT_METHOD_INFO[method].label}
            </span>{" "}
            – {PAYMENT_METHOD_INFO[method].description}
            {method === "cod" &&
              ` (a ${formatPrice(commerce.codFee)} handling fee applies)`}
            .
          </li>
        ))}
        <li>
          All online payments are processed over a secure, encrypted connection.
        </li>
      </HelpSection>

      <HelpSection id="contact" icon={<Phone />} title="Contact us">
        <li>
          Call{" "}
          <a
            href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
            className="font-semibold text-brand-700 hover:underline"
          >
            {brand.contact.phone}
          </a>{" "}
          ({brand.contact.hours})
        </li>
        <li>
          Email{" "}
          <a
            href={`mailto:${brand.contact.email}`}
            className="font-semibold text-brand-700 hover:underline"
          >
            {brand.contact.email}
          </a>
        </li>
        <li>{brand.contact.address}</li>
      </HelpSection>
    </div>
  </div>
)

const HelpSection = ({
  id,
  icon,
  title,
  children,
}: {
  id: string
  icon: ReactNode
  title: string
  children: ReactNode
}) => (
  <section
    id={id}
    aria-labelledby={`${id}-title`}
    className="rounded-2xl border border-grey-10 bg-white p-6 shadow-card small:p-8"
  >
    <div className="mb-4 flex items-center gap-3">
      <span
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
        aria-hidden="true"
      >
        {icon}
      </span>
      <h2
        id={`${id}-title`}
        className="font-display text-lg font-bold text-navy-900"
      >
        {title}
      </h2>
    </div>
    <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-grey-60 marker:text-brand-300">
      {children}
    </ul>
  </section>
)

export default HelpTemplate
