import type { Metadata } from "next"
import { notFound } from "next/navigation"

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
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<ListingSearchParams>
}

/** Categories are flat, so only single-segment paths can match. */
async function resolveCategory(segments: string[]) {
  if (segments.length !== 1) return null
  return getCategoryBySlug(decodeURIComponent(segments[0]).toLowerCase())
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { category: segments } = await props.params
  const category = await resolveCategory(segments)

  if (!category) notFound()

  return {
    title: category.name,
    description: category.shortDescription || category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${brand.name}`,
      description: category.shortDescription || category.description,
      images: category.image ? [{ url: category.image.url, alt: category.image.alt }] : [],
    },
  }
}

export default async function CategoryPage(props: Props) {
  const [{ category: segments }, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])
  const category = await resolveCategory(segments)

  if (!category) notFound()

  // The category comes from the path; a stray ?category= must not override it.
  const filters = { ...parseListingParams(searchParams), category: undefined }

  const [result, priceRange, categories] = await Promise.all([
    listProducts(toProductQuery(filters, category.id)),
    getPriceRange(category.id),
    listCategories(),
  ])

  return (
    <ProductListingTemplate
      basePath={`/categories/${category.slug}`}
      title={category.name}
      description={category.description}
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "All products", href: "/store" },
        { label: category.name },
      ]}
      filters={filters}
      result={result}
      priceRange={priceRange}
      categories={categories.filter((c) => c.id !== category.id)}
    />
  )
}
