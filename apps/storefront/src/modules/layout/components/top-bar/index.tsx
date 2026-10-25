import { Phone, TruckFast } from "@medusajs/icons"

import { brand, commerce } from "@lib/brand"
import { formatPrice } from "@lib/util/format-price"

const TopBar = () => (
  <div className="hidden bg-navy-900 text-white xsmall:block">
    <div className="content-container flex h-9 items-center justify-between gap-4 text-xs">
      <p className="flex items-center gap-2 font-medium">
        <TruckFast className="text-brand-300" aria-hidden="true" />
        Free delivery on orders above{" "}
        {formatPrice(commerce.freeShippingThreshold)}
      </p>
      <a
        href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
        className="flex items-center gap-2 text-white/80 transition-colors hover:text-white"
      >
        <Phone aria-hidden="true" />
        <span>
          <span className="hidden small:inline">Customer care: </span>
          {brand.contact.phone}
        </span>
      </a>
    </div>
  </div>
)

export default TopBar
