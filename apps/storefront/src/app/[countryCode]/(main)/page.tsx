import { Metadata } from "next"
import { Suspense } from "react"

import { brand } from "@lib/brand"
import { listCategories } from "@lib/services/category-service"
import {
  getBestSellers,
  getDealProducts,
  getFeaturedProducts,
  getNewArrivals,
} from "@lib/services/product-service"
import CategoryGrid from "@modules/home/components/category-grid"
import Hero from "@modules/home/components/hero"
import ProductRail from "@modules/home/components/product-rail"
import ProductRailSkeleton from "@modules/home/components/product-rail/skeleton"
import PromoBanners from "@modules/home/components/promo-banners"
import WhyChooseUs from "@modules/home/components/why-choose-us"
import { getStoreStats } from "@modules/home/lib/store-stats"

export const metadata: Metadata = {
  title: { absolute: `${brand.name} | ${brand.tagline}` },
  description: brand.description,
}

export default async function Home() {
  const [featured, categories, stats] = await Promise.all([
    getFeaturedProducts(),
    listCategories(),
    getStoreStats(),
  ])

  return (
    <>
      <Hero products={featured} stats={stats} />
      <CategoryGrid categories={categories} />

      <Suspense fallback={<ProductRailSkeleton />}>
        <ProductRail
          id="featured-products"
          title="Featured products"
          subtitle="Hand-picked favourites for your home"
          action={{ label: "View all", href: "/store?sort=popular" }}
          load={getFeaturedProducts}
        />
      </Suspense>

      <Suspense>
        <PromoBanners />
      </Suspense>

      <Suspense fallback={<ProductRailSkeleton />}>
        <ProductRail
          id="best-sellers"
          title="Best sellers"
          subtitle="What shoppers are buying the most"
          action={{ label: "View all", href: "/store?sort=popular" }}
          load={getBestSellers}
        />
      </Suspense>

      <Suspense fallback={<ProductRailSkeleton />}>
        <ProductRail
          id="todays-deals"
          title="Today's deals"
          subtitle="Big savings on everyday essentials"
          action={{ label: "See all deals", href: "/store?sale=1" }}
          load={getDealProducts}
        />
      </Suspense>

      <Suspense fallback={<ProductRailSkeleton />}>
        <ProductRail
          id="new-arrivals"
          title="New arrivals"
          subtitle="Fresh additions to the store"
          action={{ label: "View all", href: "/store?sort=newest" }}
          load={getNewArrivals}
        />
      </Suspense>

      <WhyChooseUs />
    </>
  )
}
