import { formatPrice, getDiscountPercent } from "@lib/util/format-price"
import { clx } from "@modules/common/components/ui"

type PriceDisplayProps = {
  price: number
  compareAtPrice?: number
  size?: "sm" | "md" | "lg"
  showDiscount?: boolean
  className?: string
}

const PriceDisplay = ({
  price,
  compareAtPrice,
  size = "md",
  showDiscount = true,
  className,
}: PriceDisplayProps) => {
  const discount = getDiscountPercent(price, compareAtPrice)

  return (
    <div
      className={clx("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}
      data-testid="price"
    >
      <span
        className={clx("font-bold text-navy-900", {
          "text-base": size === "sm",
          "text-xl": size === "md",
          "text-3xl font-display": size === "lg",
        })}
      >
        {formatPrice(price)}
      </span>
      {discount > 0 && (
        <>
          <span
            className={clx("text-grey-50 line-through", {
              "text-xs": size === "sm",
              "text-sm": size === "md",
              "text-base": size === "lg",
            })}
            data-testid="original-price"
          >
            {formatPrice(compareAtPrice!)}
          </span>
          {showDiscount && (
            <span
              className={clx("font-semibold text-success-700", {
                "text-xs": size !== "lg",
                "text-sm": size === "lg",
              })}
            >
              {discount}% off
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default PriceDisplay
