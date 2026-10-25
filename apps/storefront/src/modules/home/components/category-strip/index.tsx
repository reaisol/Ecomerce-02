import { HttpTypes } from "@medusajs/types"
import Link from "next/link"

const palette = [
  "bg-amber-100 text-amber-950",
  "bg-sky-100 text-sky-950",
  "bg-violet-100 text-violet-950",
  "bg-rose-100 text-rose-950",
  "bg-emerald-100 text-emerald-950",
  "bg-orange-100 text-orange-950",
]

export default function CategoryStrip({
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
    <nav aria-label="Shop by category" className="border-b border-grey-10 bg-white">
      <div className="content-container">
        <ul className="no-scrollbar flex gap-3 overflow-x-auto py-4 small:justify-between small:gap-5">
          {categories.map((category, index) => (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/${countryCode}/categories/${category.handle}`}
                className="group flex w-16 flex-col items-center gap-2 text-center small:w-[76px]"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-semibold transition-transform duration-200 group-hover:-translate-y-0.5 small:h-12 small:w-12 ${palette[index % palette.length]}`}
                >
                  {category.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="line-clamp-1 text-[11px] font-semibold leading-4 text-grey-80 small:text-xs">
                  {category.name}
                </span>
              </Link>
            </li>
          ))}
          <li className="shrink-0">
            <Link
              href={`/${countryCode}/store`}
              className="flex w-16 flex-col items-center gap-2 text-center small:w-[76px]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-grey-10 text-xl font-semibold text-grey-80 small:h-12 small:w-12">
                +
              </span>
              <span className="text-[11px] font-semibold leading-4 text-grey-80 small:text-xs">
                View all
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
