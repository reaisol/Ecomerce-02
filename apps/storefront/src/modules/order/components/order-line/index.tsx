import { formatLineOptions } from "@lib/cart/format-line-options"
import type { CartLine } from "@lib/cart/types"
import { formatPrice } from "@lib/util/format-price"
import ProductImage from "@modules/common/components/product-image"

/** Read-only line used in the checkout summary and on the order confirmation. */
const OrderLine = ({ line }: { line: CartLine }) => {
  const optionsText = formatLineOptions(line.options)

  return (
    <li className="flex items-center gap-3" data-testid="order-line">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-grey-10 bg-surface-subtle">
        <ProductImage src={line.image} alt={line.name} sizes="56px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium text-navy-900">
          {line.name}
        </p>
        <p className="truncate text-xs text-grey-50">
          {optionsText && `${optionsText} · `}Qty {line.quantity} ×{" "}
          {formatPrice(line.unitPrice)}
        </p>
      </div>
      <p className="shrink-0 text-sm font-semibold tabular-nums text-navy-900">
        {formatPrice(line.unitPrice * line.quantity)}
      </p>
    </li>
  )
}

export default OrderLine
