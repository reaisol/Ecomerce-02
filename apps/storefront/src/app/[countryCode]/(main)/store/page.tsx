import type { Metadata } from "next"

import { brand } from "@lib/brand"
import { getCategoryBySlug, listCategories } from "@lib/services/category-service"
import { getPriceRange, listProducts } from "@lib/services/product-service"
import ProductListingTemplate from "@modules/store/templates/product-listing-template"
import {
  parseListingParams,
  toProductQuery,
  type ListingSearchParams,
} from "@modules/store/lib/parse-listing-params"

type Props = {
  searchParams: Promise<ListingSearchParams>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { q } = parseListingParams(await props.searchParams)

  if (q) {
    return {
      title: `Search results for "${q}"`,
      description: `Shop ${q} at ${brand.name}. ${brand.tagline}`,
      robots: { index: false },
    }
  }

  return {
    title: "Shop all products",
    description: brand.description,
  }
}

export default async function StorePage(props: Props) {
  const filters = parseListingParams(await props.searchParams)
  const [categories, selectedCategory] = await Promise.all([
    listCategories(),
    filters.category ? getCategoryBySlug(filters.category) : null,
  ])
  const effectiveFilters = selectedCategory
    ? filters
    : { ...filters, category: undefined }

  const [result, priceRange] = await Promise.all([
    listProducts(toProductQuery(effectiveFilters, selectedCategory?.id)),
    getPriceRange(selectedCategory?.id),
  ])

  return (
    <ProductListingTemplate
      basePath="/store"
      title={filters.q ? `Results for "${filters.q}"` : "All products"}
      description={
        filters.q
          ? undefined
          : "Everyday essentials for kitchen, storage, cleaning and home, with fast delivery across India."
      }
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: filters.q ? "Search" : "All products" },
      ]}
      filters={effectiveFilters}
      result={result}
      priceRange={priceRange}
      categories={categories}
      showCategoryFilter
      showSearch
    />
  )
}
