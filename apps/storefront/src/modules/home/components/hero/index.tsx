import { ArrowPath, StarSolid, TruckFast } from "@medusajs/icons"

import { commerce } from "@lib/brand"
import { formatPrice } from "@lib/util/format-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { RETURN_WINDOW_DAYS } from "@modules/help/lib/policies"
import type { StoreStats } from "@modules/home/lib/store-stats"

import HeroCollage from "./hero-collage"

const ctaBase =
  "inline-flex h-12 items-center justify-center rounded-xl px-6 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"

const numberFormatter = new Intl.NumberFormat(commerce.locale)

const Hero = ({ stats }: { stats: StoreStats }) => {
  return (
    <section className="content-container pt-4 small:pt-6">
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-brand-100 px-5 py-8 xsmall:px-8 small:grid-cols-[1fr_1.1fr] small:gap-12 small:px-14 small:py-14">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-card">
            <TruckFast aria-hidden="true" />
            Delivering across India
          </p>
          <h1 className="font-display text-[2rem] font-extrabold leading-[1.1] tracking-tight text-navy-900 xsmall:text-[2.5rem] small:text-5xl medium:text-[3.5rem]">
            Everything your home &amp; kitchen needs
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-grey-60 small:text-lg">
            Cookware, storage, cleaning and everyday tools, picked for quality
            and priced honestly.
          </p>
          <div className="mt-7 flex flex-col gap-3 xsmall:flex-row">
            <LocalizedClientLink
              href="/store"
              className={`${ctaBase} bg-brand-600 text-white hover:bg-brand-700`}
            >
              Shop now
            </LocalizedClientLink>
            <LocalizedClientLink
              href="/store?sale=1"
              className={`${ctaBase} border border-brand-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50`}
            >
              Today&apos;s deals
            </LocalizedClientLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-grey-70">
            {stats.reviewCount > 0 && (
              <li className="flex items-center gap-1.5">
                <StarSolid className="text-warning-600" aria-hidden="true" />
                <span>
                  <strong className="font-semibold text-navy-900">
                    {stats.averageRating.toFixed(1)}/5
                  </strong>{" "}
                  from {numberFormatter.format(stats.reviewCount)} reviews
                </span>
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <TruckFast className="text-brand-600" aria-hidden="true" />
              Free delivery over {formatPrice(commerce.freeShippingThreshold)}
            </li>
            <li className="flex items-center gap-1.5">
              <ArrowPath className="text-brand-600" aria-hidden="true" />
              {RETURN_WINDOW_DAYS}-day easy returns
            </li>
          </ul>
        </div>
        <HeroCollage />
      </div>
    </section>
  )
}

export default Hero
