"use client"

import type { Product, ProductVariant } from "@lib/catalog/types"
import { clx } from "@modules/common/components/ui"
import {
  getOptionValueState,
  selectOptionValue,
} from "@modules/products/lib/variant-selection"

type VariantSelectorProps = {
  product: Product
  selected: ProductVariant
  onSelect: (variant: ProductVariant) => void
}

const VariantSelector = ({ product, selected, onSelect }: VariantSelectorProps) => (
  <div className="flex flex-col gap-5" data-testid="variant-selector">
    {product.options.map((option) => (
      <fieldset key={option.name}>
        <legend className="mb-2 text-sm text-grey-60">
          {option.name}:{" "}
          <span className="font-semibold text-navy-900">
            {selected.options[option.name] ?? "Select"}
          </span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {option.values.map((value) => {
            const isSelected = selected.options[option.name] === value
            const { isAvailable, isSelectable } = getOptionValueState(
              product,
              selected,
              option.name,
              value
            )

            return (
              <button
                key={value}
                type="button"
                disabled={!isSelectable && !isSelected}
                aria-pressed={isSelected}
                title={isAvailable ? undefined : "Out of stock in this combination"}
                onClick={() => {
                  const next = selectOptionValue(product, selected, option.name, value)
                  if (next && next.id !== selected.id) onSelect(next)
                }}
                className={clx(
                  "min-h-[2.5rem] rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1",
                  isSelected
                    ? "border-brand-600 bg-brand-50 text-brand-800 ring-1 ring-brand-600"
                    : "border-grey-20 bg-white text-navy-900 hover:border-brand-300",
                  !isAvailable && "text-grey-40 line-through decoration-grey-40",
                  !isAvailable && !isSelected && "border-dashed",
                  !isSelectable && !isSelected && "cursor-not-allowed bg-surface-muted hover:border-grey-20"
                )}
                data-testid="option-button"
              >
                {value}
              </button>
            )
          })}
        </div>
      </fieldset>
    ))}
  </div>
)

export default VariantSelector
