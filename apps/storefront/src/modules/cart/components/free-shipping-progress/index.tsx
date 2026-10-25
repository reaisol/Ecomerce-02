import { TruckFast } from "@medusajs/icons"

import { commerce } from "@lib/brand"
import { formatPrice } from "@lib/util/format-price"
import { clx } from "@modules/common/components/ui"

type FreeShippingProgressProps = {
  amountRemaining: number
  className?: string
}

const FreeShippingProgress = ({
  amountRemaining,
  className,
}: FreeShippingProgressProps) => {
  const threshold = commerce.freeShippingThreshold
  const unlocked = amountRemaining <= 0
  const progress = unlocked
    ? 100
    : Math.round(((threshold - amountRemaining) / threshold) * 100)

  return (
    <div
      className={clx(
        "rounded-xl px-3 py-2.5",
        unlocked ? "bg-success-50" : "bg-brand-50",
        className
      )}
      data-testid="free-shipping-progress"
    >
      <p
        className={clx(
          "flex items-center gap-2 text-sm",
          unlocked ? "text-success-700" : "text-navy-800"
        )}
      >
        <TruckFast className="shrink-0" aria-hidden />
        {unlocked ? (
          <span className="font-medium">You have unlocked free delivery</span>
        ) : (
          <span>
            Add{" "}
            <span className="font-semibold">{formatPrice(amountRemaining)}</span>{" "}
            more for free delivery
          </span>
        )}
      </p>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-white"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Progress towards free delivery"
      >
        <div
          className={clx(
            "h-full rounded-full transition-[width] duration-300",
            unlocked ? "bg-success-600" : "bg-brand-600"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default FreeShippingProgress
