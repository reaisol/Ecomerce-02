import { Suspense } from "react"

import type { Category, Product, ProductVariant } from "@lib/catalog/types"
import DeliveryInfo from "@modules/products/components/delivery-info"
import FrequentlyBoughtTogether from "@modules/products/components/frequently-bought-together"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductDetails from "@modules/products/components/product-details"
import PurchasePanel from "@modules/products/components/purchase-panel"
import RatingStars from "@modules/products/components/rating-stars"
import RelatedProducts from "@modules/products/components/related-products"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import Breadcrumbs from "@modules/store/components/breadcrumbs"

type ProductDetailTemplateProps = {
  product: Product
  category: Category | null
  initialVariant: ProductVariant
}

const ProductDetailTemplate = ({
  product,
  category,
  initialVariant,
}: ProductDetailTemplateProps) => (
  <div className="bg-surface-muted pb-16" data-testid="product-container">
    <div className="content-container pt-4 small:pt-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(category
            ? [{ label: category.name, href: `/categories/${category.slug}` }]
            : [{ label: "All products", href: "/store" }]),
          { label: product.name },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-6 small:mt-6 small:grid-cols-2 small:gap-10 medium:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="small:sticky small:top-28 small:self-start">
          <ImageGallery images={product.images} productName={product.name} />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="rounded-2xl bg-white p-5 shadow-card small:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-600">
              {product.brand}
            </p>
            <h1
              className="mt-1.5 font-display text-xl font-bold leading-snug text-navy-900 small:text-2xl"
              data-testid="product-title"
            >
              {product.name}
            </h1>
            <RatingStars
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="md"
              className="mt-2"
            />
            {product.shortDescription && (
              <p className="mt-3 text-sm leading-6 text-grey-60">
                {product.shortDescription}
              </p>
            )}
            <hr className="my-5 border-grey-10" />
            <PurchasePanel product={product} initialVariant={initialVariant} />
          </div>
          <DeliveryInfo />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 small:mt-10">
        <Suspense fallback={null}>
          <FrequentlyBoughtTogether product={product} />
        </Suspense>
        <ProductDetails product={product} category={category} />
      </div>

      <div className="mt-12">
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} category={category} />
        </Suspense>
      </div>
    </div>
  </div>
)

export default ProductDetailTemplate
