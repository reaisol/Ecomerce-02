import type { Product } from "@lib/catalog/types"
import { formatPrice } from "@lib/util/format-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImage from "@modules/common/components/product-image"
import { clx } from "@modules/common/components/ui"

export const COLLAGE_SIZE = 3

export const getCollageProducts = (products: Product[]) =>
  products.filter((p) => p.thumbnail).slice(0, COLLAGE_SIZE)

/** One large and two small product tiles. */
const HeroCollage = ({ products }: { products: Product[] }) => {
  const [lead, ...rest] = products

  return (
    <div className="grid h-64 grid-cols-[1.6fr_1fr] grid-rows-2 gap-3 xsmall:h-80 small:h-[420px] small:gap-4">
      <CollageTile product={lead} className="row-span-2" priority showPrice />
      {rest.map((product) => (
        <CollageTile key={product.id} product={product} />
      ))}
    </div>
  )
}

const CollageTile = ({
  product,
  className,
  priority,
  showPrice,
}: {
  product: Product
  className?: string
  priority?: boolean
  showPrice?: boolean
}) => (
  <LocalizedClientLink
    href={`/products/${product.slug}`}
    className={clx(
      "group relative overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover",
      className
    )}
  >
    <ProductImage
      src={product.thumbnail?.url}
      alt={product.thumbnail?.alt ?? product.name}
      sizes="(max-width: 1024px) 60vw, 30vw"
      priority={priority}
      className="transition-transform duration-300 group-hover:scale-[1.03]"
    />
    {showPrice && (
      <span className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-card backdrop-blur">
        <span className="truncate text-xs font-medium text-navy-900 small:text-sm">
          {product.name}
        </span>
        <span className="shrink-0 text-sm font-bold text-brand-700">
          {formatPrice(product.price)}
        </span>
      </span>
    )}
  </LocalizedClientLink>
)

export default HeroCollage
