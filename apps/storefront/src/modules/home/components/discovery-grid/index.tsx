import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

const cardStyles = [
  "from-[#e6efff] via-[#d8e6ff] to-[#b6cff7]",
  "from-[#fbe7ea] via-[#f4d3dd] to-[#dca8b9]",
  "from-[#e7f4e8] via-[#d6ebd9] to-[#afd2b4]",
]

export default function DiscoveryGrid({
  categories,
  countryCode,
}: {
  categories: HttpTypes.StoreProductCategory[]
  countryCode: string
}) {
  if (!categories.length) {
    return null
  }

  return (
    <section className="content-container py-8 small:py-12" aria-labelledby="discover-heading">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-grey-50">
            Browse the shop
          </p>
          <h2 id="discover-heading" className="mt-1 text-2xl font-semibold tracking-tight text-grey-90 small:text-3xl">
            Find your next favourite
          </h2>
        </div>
        <Link href={`/${countryCode}/store`} className="text-sm font-semibold text-grey-80 underline underline-offset-4 hover:text-black">
          Shop all
        </Link>
      </div>
      <div className="grid gap-4 small:grid-cols-3 small:gap-5">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={`/${countryCode}/categories/${category.handle}`}
            className={`group relative min-h-48 overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${cardStyles[index % cardStyles.length]}`}
          >
            <span className="absolute -bottom-10 -right-6 text-[11rem] font-black leading-none text-white/35 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
              {category.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="relative flex h-full flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-grey-60">Curated picks</span>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-grey-90">{category.name}</h3>
                <span className="mt-2 inline-flex text-sm font-semibold text-grey-80 underline underline-offset-4">Shop now</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
