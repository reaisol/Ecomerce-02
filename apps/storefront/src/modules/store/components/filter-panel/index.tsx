"use client"

import type { PriceRange } from "@lib/catalog/types"
import {
  formatPriceBand,
  QUICK_PRICE_BANDS,
  RATING_THRESHOLDS,
  type ListingFilters,
  type PriceBand,
} from "@modules/store/lib/listing-filters"

import FilterSection from "./filter-section"
import OptionRow from "./option-row"
import PriceInputs from "./price-inputs"

export type CategoryOption = {
  slug: string
  name: string
  productCount: number
}

type FilterPanelProps = {
  value: ListingFilters
  onChange: (next: ListingFilters) => void
  priceRange: PriceRange
  /** Shown only where the listing spans several categories. */
  categories?: CategoryOption[]
  /** Keeps radio/checkbox ids unique when the panel renders twice (sidebar and sheet). */
  idPrefix: string
}

const isSameBand = (value: ListingFilters, band: PriceBand) =>
  value.min === band.min && value.max === band.max

const FilterPanel = ({
  value,
  onChange,
  priceRange,
  categories,
  idPrefix,
}: FilterPanelProps) => {
  const update = (changes: Partial<ListingFilters>) =>
    onChange({ ...value, ...changes, page: 1 })

  return (
    <div className="divide-y divide-grey-10" data-testid="filter-panel">
      {categories && categories.length > 0 && (
        <FilterSection title="Category">
          <OptionRow
            id={`${idPrefix}-category-all`}
            type="radio"
            name={`${idPrefix}-category`}
            label="All products"
            checked={!value.category}
            onChange={() => update({ category: undefined })}
          />
          {categories.map((category) => (
            <OptionRow
              key={category.slug}
              id={`${idPrefix}-category-${category.slug}`}
              type="radio"
              name={`${idPrefix}-category`}
              label={category.name}
              count={category.productCount}
              checked={value.category === category.slug}
              onChange={() => update({ category: category.slug })}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Price">
        {QUICK_PRICE_BANDS.map((band) => {
          const selected = isSameBand(value, band)
          return (
            <OptionRow
              key={formatPriceBand(band)}
              id={`${idPrefix}-price-${band.min ?? 0}-${band.max ?? "up"}`}
              type="checkbox"
              label={formatPriceBand(band)}
              checked={selected}
              onChange={() =>
                update(
                  selected
                    ? { min: undefined, max: undefined }
                    : { min: band.min, max: band.max }
                )
              }
            />
          )
        })}
        <PriceInputs
          key={`${value.min ?? ""}-${value.max ?? ""}`}
          idPrefix={idPrefix}
          min={value.min}
          max={value.max}
          bounds={priceRange}
          onCommit={(min, max) => update({ min, max })}
        />
      </FilterSection>

      <FilterSection title="Customer rating">
        {RATING_THRESHOLDS.map((threshold) => (
          <OptionRow
            key={threshold}
            id={`${idPrefix}-rating-${threshold}`}
            type="checkbox"
            label={`${threshold}★ & up`}
            checked={value.rating === threshold}
            onChange={() =>
              update({
                rating: value.rating === threshold ? undefined : threshold,
              })
            }
          />
        ))}
      </FilterSection>

      <FilterSection title="Availability">
        <OptionRow
          id={`${idPrefix}-stock`}
          type="checkbox"
          label="In stock only"
          checked={value.inStock}
          onChange={() => update({ inStock: !value.inStock })}
        />
      </FilterSection>

      <FilterSection title="Offers">
        <OptionRow
          id={`${idPrefix}-sale`}
          type="checkbox"
          label="On sale"
          checked={value.onSale}
          onChange={() => update({ onSale: !value.onSale })}
        />
      </FilterSection>
    </div>
  )
}

export default FilterPanel
