import { Metadata } from "next"
import { Suspense } from "react"

import CategoryStrip from "@modules/home/components/category-strip"
import DiscoveryGrid from "@modules/home/components/discovery-grid"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import HomeProductRailsSkeleton from "@modules/home/components/home-product-rails-skeleton"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Discover something new",
  description:
    "Shop curated collections, new arrivals, and everyday favourites.",
}

// Product categories and collections are refreshed at most every five minutes.
// This keeps the homepage fast while allowing Admin inventory changes to appear
// without a deployment.
export const revalidate = 300

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const [region, { collections }, categories] = await Promise.all([
    getRegion(countryCode),
    listCollections({
      fields: "id,handle,title",
      limit: "3",
    }),
    listCategories({
      fields: "id,name,handle,description,parent_category",
      limit: 30,
    }),
  ])

  if (!collections || !region) {
    return null
  }

  const topLevelCategories = categories
    .filter((category) => !category.parent_category)
    .slice(0, 12)

  return (
    <>
      <CategoryStrip
        categories={topLevelCategories}
        countryCode={countryCode}
      />
      <Hero countryCode={countryCode} />
      <DiscoveryGrid
        categories={topLevelCategories.slice(0, 3)}
        countryCode={countryCode}
      />
      <Suspense fallback={<HomeProductRailsSkeleton />}>
        <div className="pb-12 small:pb-20">
          <ul className="flex flex-col">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      </Suspense>
    </>
  )
}
