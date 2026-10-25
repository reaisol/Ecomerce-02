import { ArrowPath, Cash, ShieldCheck, TruckFast } from "@medusajs/icons"
import type { ComponentType } from "react"

import { commerce } from "@lib/brand"
import { formatPrice } from "@lib/util/format-price"

type Perk = {
  icon: ComponentType<{ className?: string }>
  title: string
  detail: string
}

const perks: Perk[] = [
  {
    icon: TruckFast,
    title: "Free delivery",
    detail: `On orders above ${formatPrice(commerce.freeShippingThreshold)}, otherwise ${formatPrice(commerce.standardShippingFee)}`,
  },
  {
    icon: ArrowPath,
    title: "7-day easy returns",
    detail: "Hassle-free returns on unused items",
  },
  {
    icon: Cash,
    title: "Cash on delivery",
    detail: `Available across India (${formatPrice(commerce.codFee)} handling fee)`,
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    detail: "UPI, cards and net banking, fully encrypted",
  },
]

const DeliveryInfo = () => (
  <ul
    className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-card small:p-5 xsmall:grid-cols-2"
    data-testid="delivery-info"
  >
    {perks.map(({ icon: Icon, title, detail }) => (
      <li key={title} className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <Icon />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-navy-900">{title}</span>
          <span className="block text-xs text-grey-50">{detail}</span>
        </span>
      </li>
    ))}
  </ul>
)

export default DeliveryInfo
