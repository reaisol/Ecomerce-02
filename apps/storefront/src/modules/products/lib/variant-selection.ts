import type { Product, ProductVariant } from "@lib/catalog/types"

export type OptionValueState = {
  /** An in-stock variant exists with this exact combination. */
  isAvailable: boolean
  /** Some in-stock variant carries this value, possibly with other options changed. */
  isSelectable: boolean
}

const matches = (variant: ProductVariant, selection: Record<string, string>) =>
  Object.entries(selection).every(([name, value]) => variant.options[name] === value)

/**
 * The variant to show first: the one named in the URL if valid, otherwise the
 * first variant that can actually be bought.
 */
export function getInitialVariant(product: Product, variantId?: string) {
  return (
    product.variants.find((v) => v.id === variantId) ??
    product.variants.find((v) => v.stock > 0) ??
    product.variants[0]
  )
}

export function getOptionValueState(
  product: Product,
  current: ProductVariant,
  optionName: string,
  value: string
): OptionValueState {
  const combination = { ...current.options, [optionName]: value }
  const exact = product.variants.find((v) => matches(v, combination))

  return {
    isAvailable: Boolean(exact && exact.stock > 0),
    isSelectable: product.variants.some(
      (v) => v.options[optionName] === value && v.stock > 0
    ),
  }
}

/**
 * Picks the variant for a newly clicked option value. Prefers the exact
 * combination; if that does not exist or is sold out, falls back to the
 * in-stock variant with this value that keeps the most other choices.
 */
export function selectOptionValue(
  product: Product,
  current: ProductVariant,
  optionName: string,
  value: string
) {
  const combination = { ...current.options, [optionName]: value }
  const exact = product.variants.find((v) => matches(v, combination))

  if (exact && exact.stock > 0) return exact

  const candidates = product.variants.filter(
    (v) => v.options[optionName] === value && v.stock > 0
  )
  const sharedOptions = (v: ProductVariant) =>
    Object.entries(current.options).filter(([name, val]) => v.options[name] === val)
      .length

  return (
    candidates.sort((a, b) => sharedOptions(b) - sharedOptions(a))[0] ?? exact
  )
}

export const hasSelectableOptions = (product: Product) =>
  product.variants.length > 1 && product.options.length > 0
