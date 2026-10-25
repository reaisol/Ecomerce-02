import type { CartTotals } from "@lib/cart/types"
import type { OrderTotals } from "@lib/orders/types"
import { formatPrice } from "@lib/util/format-price"
import { clx } from "@modules/common/components/ui"

type PriceBreakdownProps = {
  /** Order totals add a payment fee (cash on delivery) that is already included in `total`. */
  totals: CartTotals | OrderTotals
  className?: string
}

const Row = ({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) => (
  <div className="flex items-center justify-between gap-4">
    <dt className="text-grey-60">{label}</dt>
    <dd className={clx("font-medium tabular-nums text-navy-900", valueClassName)}>
      {value}
    </dd>
  </div>
)

/** The MRP → discount → delivery → total breakdown shared by cart, checkout and order confirmation. */
const PriceBreakdown = ({ totals, className }: PriceBreakdownProps) => {
  const paymentFee = "paymentFee" in totals ? totals.paymentFee : 0

  return (
    <div className={className} data-testid="price-breakdown">
      <dl className="flex flex-col gap-3 text-sm">
        <Row
          label={`MRP (${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"})`}
          value={formatPrice(totals.mrpTotal)}
        />
        {totals.savings > 0 && (
          <Row
            label="Discount on MRP"
            value={`−${formatPrice(totals.savings)}`}
            valueClassName="text-success-700"
          />
        )}
        <Row
          label="Delivery"
          value={totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}
          valueClassName={totals.shipping === 0 ? "text-success-700" : undefined}
        />
        {paymentFee > 0 && (
          <Row label="Cash on delivery fee" value={formatPrice(paymentFee)} />
        )}
        <div className="mt-1 flex items-center justify-between gap-4 border-t border-dashed border-grey-20 pt-4">
          <dt className="text-base font-semibold text-navy-900">Total amount</dt>
          <dd
            className="text-lg font-bold tabular-nums text-navy-900"
            data-testid="price-breakdown-total"
          >
            {formatPrice(totals.total)}
          </dd>
        </div>
      </dl>
      {totals.savings > 0 && (
        <p className="mt-4 rounded-lg bg-success-50 px-3 py-2 text-sm font-medium text-success-700">
          You save {formatPrice(totals.savings)} on this order
        </p>
      )}
    </div>
  )
}

export default PriceBreakdown
