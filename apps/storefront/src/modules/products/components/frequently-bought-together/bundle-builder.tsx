"use client"

import { Plus, ShoppingCart } from "@medusajs/icons"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { cartActions } from "@lib/cart/cart-store"
import { toCartLine } from "@lib/cart/to-cart-line"
import type { Product, ProductVariant } from "@lib/catalog/types"
import { formatPrice } from "@lib/util/format-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImage from "@modules/common/components/product-image"
import { Button } from "@modules/common/components/ui"
import { getInitialVariant } from "@modules/products/lib/variant-selection"

type BundleItem = {
  product: Product
  /** Undefined when the shopper must choose options on the product page. */
  variant?: ProductVariant
  isCurrent: boolean
}

function toBundleItem(product: Product, isCurrent: boolean, variantId?: string): BundleItem {
  if (isCurrent) {
    const variant = getInitialVariant(product, variantId)
    return { product, isCurrent, variant: variant.stock > 0 ? variant : undefined }
  }
  const single = product.variants.length === 1 ? product.variants[0] : undefined
  return { product, isCurrent, variant: single && single.stock > 0 ? single : undefined }
}

type BundleBuilderProps = {
  product: Product
  complements: Product[]
}

const BundleBuilder = ({ product, complements }: BundleBuilderProps) => {
  // Follows the variant chosen in the purchase panel, which lives in the URL.
  const variantId = useSearchParams().get("variant") ?? undefined
  const items = [
    toBundleItem(product, true, variantId),
    ...complements.map((complement) => toBundleItem(complement, false)),
  ]
  const [excluded, setExcluded] = useState<Set<string>>(new Set())

  const selected = items.filter(
    (item): item is BundleItem & { variant: ProductVariant } =>
      Boolean(item.variant) && !excluded.has(item.product.id)
  )
  const total = selected.reduce((sum, item) => sum + item.variant.price, 0)

  const toggle = (productId: string) =>
    setExcluded((current) => {
      const next = new Set(current)
      if (next.has(productId)) {
        next.delete(productId)
      } else {
        next.add(productId)
      }
      return next
    })

  const addSelected = () =>
    selected.forEach((item, index) =>
      cartActions.addItem(
        toCartLine(item.product, item.variant),
        1,
        index === selected.length - 1
      )
    )

  return (
    <div className="grid grid-cols-1 gap-6 small:grid-cols-[minmax(0,1fr)_280px] small:items-center">
      <div>
        <ul className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1" aria-hidden>
          {items.map((item, index) => (
            <li key={item.product.id} className="flex shrink-0 items-center gap-2">
              {index > 0 && <Plus className="text-grey-40" />}
              <span className="relative block h-20 w-20 overflow-hidden rounded-xl border border-grey-10 bg-surface-subtle small:h-24 small:w-24">
                <ProductImage
                  src={item.product.thumbnail?.url}
                  alt=""
                  sizes="96px"
                />
              </span>
            </li>
          ))}
        </ul>

        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map((item) => (
            <BundleRow
              key={item.product.id}
              item={item}
              checked={Boolean(item.variant) && !excluded.has(item.product.id)}
              onToggle={() => toggle(item.product.id)}
            />
          ))}
        </ul>
      </div>

      <div className="rounded-2xl bg-surface-muted p-5">
        <p className="text-sm text-grey-60">
          Total for {selected.length} {selected.length === 1 ? "item" : "items"}
        </p>
        <p className="mt-1 font-display text-2xl font-bold text-navy-900">
          {formatPrice(total)}
        </p>
        <Button
          onClick={addSelected}
          disabled={!selected.length}
          className="mt-4 w-full"
          data-testid="add-bundle-button"
        >
          <ShoppingCart aria-hidden />
          Add selected to cart
        </Button>
      </div>
    </div>
  )
}

const BundleRow = ({
  item,
  checked,
  onToggle,
}: {
  item: BundleItem
  checked: boolean
  onToggle: () => void
}) => {
  const { product, variant, isCurrent } = item
  const inputId = `bundle-${product.id}`
  const optionLabel = variant ? Object.values(variant.options).join(", ") : ""

  return (
    <li className="flex items-start gap-3 text-sm">
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        disabled={!variant}
        onChange={onToggle}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-600 disabled:cursor-not-allowed"
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={inputId} className="cursor-pointer text-navy-900">
          {isCurrent && <span className="font-semibold">This item: </span>}
          {isCurrent ? (
            product.name
          ) : (
            <LocalizedClientLink
              href={`/products/${product.slug}`}
              className="hover:text-brand-700 hover:underline"
            >
              {product.name}
            </LocalizedClientLink>
          )}
          {optionLabel && <span className="text-grey-50"> ({optionLabel})</span>}
        </label>
        {!variant && !isCurrent && (
          <LocalizedClientLink
            href={`/products/${product.slug}`}
            className="mt-0.5 block text-xs font-semibold text-brand-700 hover:underline"
          >
            Choose options
          </LocalizedClientLink>
        )}
        {!variant && isCurrent && (
          <span className="mt-0.5 block text-xs text-danger-600">
            Currently out of stock
          </span>
        )}
      </div>
      <span className="shrink-0 font-semibold text-navy-900">
        {formatPrice(variant?.price ?? product.price)}
      </span>
    </li>
  )
}

export default BundleBuilder
