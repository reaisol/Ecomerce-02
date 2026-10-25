import type { Product } from "@lib/catalog/types"
import { getDiscountPercent } from "@lib/util/format-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImage from "@modules/common/components/product-image"
import PriceDisplay from "@modules/products/components/price-display"
import RatingStars from "@modules/products/components/rating-stars"

import QuickAddButton from "./quick-add-button"

const LOW_STOCK_THRESHOLD = 5

const ProductCard = ({
  product,
  priority,
}: {
  product: Product
  priority?: boolean
}) => {
  const discount = getDiscountPercent(product.price, product.compareAtPrice)
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-grey-10 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover"
      data-testid="product-card"
    >
      <LocalizedClientLink
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-subtle"
      >
        <ProductImage
          src={product.thumbnail?.url}
          alt={product.thumbnail?.alt ?? product.name}
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {discount > 0 && (
            <span className="rounded-md bg-success-600 px-2 py-0.5 text-xs font-bold text-white">
              {discount}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-md bg-brand-600 px-2 py-0.5 text-xs font-bold text-white">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="rounded-md bg-navy-900 px-2 py-0.5 text-xs font-bold text-white">
              BESTSELLER
            </span>
          )}
        </div>
        {product.stock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white">
              Out of stock
            </span>
          </div>
        )}
      </LocalizedClientLink>

      <div className="flex flex-1 flex-col gap-2 p-3 small:p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-600">
          {product.brand}
        </span>
        <LocalizedClientLink
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5 text-navy-900 hover:text-brand-700"
          data-testid="product-title"
        >
          {product.name}
        </LocalizedClientLink>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          size="sm"
        />
        <p className="h-4 text-xs font-medium text-warning-600">
          {isLowStock ? `Only ${product.stock} left` : ""}
        </p>
        <div className="mt-auto pt-1">
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  )
}

export default ProductCard
