"use client"

import { Minus, Plus } from "@medusajs/icons"

import { clx } from "@modules/common/components/ui"

type QuantitySelectorProps = {
  value: number
  max: number
  onChange: (value: number) => void
  min?: number
  size?: "sm" | "md"
  disabled?: boolean
  className?: string
}

const QuantitySelector = ({
  value,
  max,
  onChange,
  min = 1,
  size = "md",
  disabled,
  className,
}: QuantitySelectorProps) => {
  const buttonClass = clx(
    "flex items-center justify-center text-navy-900 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-grey-30 disabled:hover:bg-transparent",
    size === "sm" ? "h-8 w-8" : "h-11 w-11"
  )

  return (
    <div
      className={clx(
        "inline-flex items-center rounded-xl border border-grey-20 bg-white",
        className
      )}
      data-testid="quantity-selector"
    >
      <button
        type="button"
        className={clx(buttonClass, "rounded-l-xl")}
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus />
      </button>
      <span
        className={clx(
          "min-w-[2.5rem] text-center font-semibold tabular-nums",
          size === "sm" ? "text-sm" : "text-base"
        )}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className={clx(buttonClass, "rounded-r-xl")}
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus />
      </button>
    </div>
  )
}

export default QuantitySelector
