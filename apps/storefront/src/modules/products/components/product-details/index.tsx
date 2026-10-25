import type { Category, Product } from "@lib/catalog/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import DetailSection from "./detail-section"

type ProductDetailsProps = {
  product: Product
  category: Category | null
}

const ProductDetails = ({ product, category }: ProductDetailsProps) => {
  const specifications = Object.entries(product.specifications)

  return (
    <div className="flex flex-col gap-4" data-testid="product-details">
      <DetailSection title="Description" id="description">
        <div className="whitespace-pre-line text-sm leading-6 text-grey-70 small:text-base small:leading-7">
          {product.description}
        </div>
      </DetailSection>

      {product.features.length > 0 && (
        <DetailSection title="Key features" id="features">
          <ul className="grid grid-cols-1 gap-2.5 small:grid-cols-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm text-grey-70">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
                  aria-hidden
                />
                {feature}
              </li>
            ))}
          </ul>
        </DetailSection>
      )}

      {specifications.length > 0 && (
        <DetailSection title="Specifications" id="specifications">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-grey-10">
              {specifications.map(([label, value]) => (
                <tr key={label}>
                  <th
                    scope="row"
                    className="w-2/5 py-2.5 pr-4 align-top font-medium text-grey-50"
                  >
                    {label}
                  </th>
                  <td className="py-2.5 text-navy-900">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DetailSection>
      )}

      <DetailSection title="More information" id="more-information">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-3 text-sm">
          <dt className="text-grey-50">SKU</dt>
          <dd className="font-medium text-navy-900">{product.sku}</dd>
          {category && (
            <>
              <dt className="text-grey-50">Category</dt>
              <dd>
                <LocalizedClientLink
                  href={`/categories/${category.slug}`}
                  className="font-medium text-brand-700 hover:underline"
                >
                  {category.name}
                </LocalizedClientLink>
              </dd>
            </>
          )}
          {product.tags.length > 0 && (
            <>
              <dt className="pt-1 text-grey-50">Tags</dt>
              <dd className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <LocalizedClientLink
                    key={tag}
                    href={`/store?q=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-grey-20 px-3 py-1 text-xs font-medium text-grey-70 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-800"
                  >
                    {tag}
                  </LocalizedClientLink>
                ))}
              </dd>
            </>
          )}
        </dl>
      </DetailSection>
    </div>
  )
}

export default ProductDetails
