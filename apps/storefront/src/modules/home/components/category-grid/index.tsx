import type { Category } from "@lib/catalog/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImage from "@modules/common/components/product-image"
import SectionHeading from "@modules/common/components/section-heading"
import { clx } from "@modules/common/components/ui"

const CategoryGrid = ({ categories }: { categories: Category[] }) => {
  if (categories.length === 0) {
    return null
  }

  // In the two-column phone layout an odd last card spans the row instead of leaving a gap.
  const hasOddTail = categories.length % 2 === 1

  return (
    <section
      className="content-container py-10 small:py-14"
      aria-labelledby="shop-by-category"
    >
      <SectionHeading
        id="shop-by-category"
        title="Shop by category"
        subtitle="Find what you need, room by room"
        action={{ label: "View all", href: "/store" }}
      />
      <ul className="grid grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-5 small:gap-5">
        {categories.map((category, index) => {
          const isWide = hasOddTail && index === categories.length - 1
          return (
            <li
              key={category.id}
              className={clx(isWide && "col-span-2 small:col-span-1")}
            >
              <CategoryCard category={category} isWide={isWide} />
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const CategoryCard = ({
  category,
  isWide,
}: {
  category: Category
  isWide: boolean
}) => (
  <LocalizedClientLink
    href={`/categories/${category.slug}`}
    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-grey-10 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover"
    data-testid="category-card"
  >
    <div
      className={clx(
        "relative overflow-hidden bg-surface-subtle",
        isWide ? "aspect-[2/1] small:aspect-[4/3]" : "aspect-[4/3]"
      )}
    >
      <ProductImage
        src={category.image?.url}
        alt={category.image?.alt ?? category.name}
        sizes="(max-width: 1024px) 50vw, 20vw"
        className="transition-transform duration-300 group-hover:scale-[1.04]"
      />
    </div>
    <div className="flex flex-1 flex-col p-3 small:p-4">
      <h3 className="font-display text-[15px] font-bold leading-5 text-navy-900 group-hover:text-brand-700 small:text-base">
        {category.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-5 text-grey-50 small:text-sm">
        {category.shortDescription}
      </p>
      <p className="mt-auto pt-2 text-xs font-semibold text-brand-700">
        {category.productCount}{" "}
        {category.productCount === 1 ? "product" : "products"}
      </p>
    </div>
  </LocalizedClientLink>
)

export default CategoryGrid
