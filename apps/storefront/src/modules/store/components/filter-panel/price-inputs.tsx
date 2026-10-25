"use client"

import { useState, type FormEvent, type ReactNode } from "react"

import type { PriceRange } from "@lib/catalog/types"
import { formatPrice } from "@lib/util/format-price"

type PriceInputsProps = {
  idPrefix: string
  min?: number
  max?: number
  bounds: PriceRange
  onCommit: (min: number | undefined, max: number | undefined) => void
}

const toNumber = (raw: string) => {
  const digits = raw.replace(/\D/g, "")
  return digits ? Number(digits) : undefined
}

/**
 * Free-form price bounds. Values commit on submit or blur so typing does not
 * trigger a navigation per keystroke.
 */
const PriceInputs = ({ idPrefix, min, max, bounds, onCommit }: PriceInputsProps) => {
  const [minText, setMinText] = useState(min?.toString() ?? "")
  const [maxText, setMaxText] = useState(max?.toString() ?? "")

  const commit = () => {
    let nextMin = toNumber(minText)
    let nextMax = toNumber(maxText)
    if (nextMin !== undefined && nextMax !== undefined && nextMin > nextMax) {
      ;[nextMin, nextMax] = [nextMax, nextMin]
    }
    if (nextMin !== min || nextMax !== max) {
      onCommit(nextMin, nextMax)
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    commit()
  }

  const inputClass =
    "h-9 w-full min-w-0 rounded-lg border border-grey-20 bg-white pl-6 pr-1.5 text-sm text-navy-900 placeholder:text-grey-40 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"

  return (
    <form onSubmit={submit} className="mt-2 flex items-end gap-2">
      <PriceField label="Min" id={`${idPrefix}-price-min`}>
        <input
          id={`${idPrefix}-price-min`}
          inputMode="numeric"
          value={minText}
          onChange={(event) => setMinText(event.target.value)}
          onBlur={commit}
          placeholder={String(bounds.min)}
          aria-label={`Minimum price, from ${formatPrice(bounds.min)}`}
          className={inputClass}
        />
      </PriceField>
      <span className="pb-2 text-grey-40" aria-hidden>
        –
      </span>
      <PriceField label="Max" id={`${idPrefix}-price-max`}>
        <input
          id={`${idPrefix}-price-max`}
          inputMode="numeric"
          value={maxText}
          onChange={(event) => setMaxText(event.target.value)}
          onBlur={commit}
          placeholder={String(bounds.max)}
          aria-label={`Maximum price, up to ${formatPrice(bounds.max)}`}
          className={inputClass}
        />
      </PriceField>
      <button
        type="submit"
        className="h-9 shrink-0 rounded-lg border border-brand-200 px-3 text-sm font-semibold text-brand-700 hover:bg-brand-50"
      >
        Go
      </button>
    </form>
  )
}

const PriceField = ({
  label,
  id,
  children,
}: {
  label: string
  id: string
  children: ReactNode
}) => (
  <div className="min-w-0 flex-1">
    <label htmlFor={id} className="mb-1 block text-xs text-grey-50">
      {label}
    </label>
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-grey-40">
        ₹
      </span>
      {children}
    </div>
  </div>
)

export default PriceInputs
