import { ArrowLeft } from "@medusajs/icons"

import { listCategories } from "@lib/services/category-service"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SearchForm from "@modules/layout/components/search-form"

export default async function NotFoundContent() {
  const categories = await listCategories()

  return (
    <section className="content-container flex flex-col items-center py-16 text-center small:py-24">
      <p
        className="font-display text-6xl font-extrabold text-brand-100 small:text-8xl"
        aria-hidden="true"
      >
        404
      </p>
      <h1 className="mt-2 font-display text-2xl font-bold text-navy-900 small:text-3xl">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-grey-60">
        The link may be broken or the page may have moved. Try a search or
        browse one of our popular categories.
      </p>

      <SearchForm id="not-found-search" className="mt-8 max-w-lg" />

      {categories.length > 0 && (
        <nav aria-label="Popular categories" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <LocalizedClientLink
                  href={`/categories/${category.slug}`}
                  className="inline-flex rounded-full border border-grey-20 bg-white px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {category.name}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <LocalizedClientLink
        href="/"
        className="mt-10 inline-flex h-12 items-center gap-2 rounded-xl bg-brand-600 px-6 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <ArrowLeft />
        Back to home
      </LocalizedClientLink>
    </section>
  )
}
