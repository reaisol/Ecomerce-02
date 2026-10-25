import {
  ArrowPath,
  CheckCircleSolid,
  ShieldCheck,
  Tag,
  TruckFast,
} from "@medusajs/icons"
import type { ReactNode } from "react"

import { commerce } from "@lib/brand"
import { formatPrice } from "@lib/util/format-price"
import { RETURN_WINDOW_DAYS } from "@modules/help/lib/policies"

type Benefit = { icon: ReactNode; title: string; description: string }

const BENEFITS: Benefit[] = [
  {
    icon: <CheckCircleSolid />,
    title: "Quality products",
    description: "Every item is checked and chosen for daily use.",
  },
  {
    icon: <Tag />,
    title: "Affordable prices",
    description: "Fair, transparent pricing with regular deals.",
  },
  {
    icon: <TruckFast />,
    title: "Fast delivery",
    description: `Quick dispatch, free above ${formatPrice(commerce.freeShippingThreshold)}.`,
  },
  {
    icon: <ShieldCheck />,
    title: "Secure payments",
    description: "UPI, cards, net banking or cash on delivery.",
  },
  {
    icon: <ArrowPath />,
    title: `Easy ${RETURN_WINDOW_DAYS}-day returns`,
    description: "Hassle-free returns if something isn't right.",
  },
]

const WhyChooseUs = () => (
  <section
    className="content-container py-10 small:py-14"
    aria-labelledby="why-choose-us"
  >
    <div className="rounded-3xl border border-grey-10 bg-white px-5 py-8 shadow-card small:px-10 small:py-10">
      <h2
        id="why-choose-us"
        className="mb-6 text-center font-display text-xl font-bold text-navy-900 small:mb-8 small:text-2xl"
      >
        Why shop with us
      </h2>
      <ul className="grid gap-5 xsmall:grid-cols-2 small:grid-cols-5 small:gap-6">
        {BENEFITS.map((benefit) => (
          <li
            key={benefit.title}
            className="flex items-start gap-3 small:flex-col small:items-center small:text-center"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
              aria-hidden="true"
            >
              {benefit.icon}
            </span>
            <div>
              <h3 className="font-display text-[15px] font-bold text-navy-900">
                {benefit.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-grey-60">
                {benefit.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

export default WhyChooseUs
