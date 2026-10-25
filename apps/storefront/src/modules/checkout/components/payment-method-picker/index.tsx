import { Buildings, Cash, CreditCard, Bolt } from "@medusajs/icons"
import type { ComponentType } from "react"

import { PAYMENT_METHOD_INFO, getPaymentFee } from "@lib/orders/payment-methods"
import { PAYMENT_METHODS, type PaymentMethod } from "@lib/orders/types"
import { formatPrice } from "@lib/util/format-price"
import { clx } from "@modules/common/components/ui"

const ICONS: Record<PaymentMethod, ComponentType<{ className?: string }>> = {
  upi: Bolt,
  card: CreditCard,
  netbanking: Buildings,
  cod: Cash,
}

type PaymentMethodPickerProps = {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

const PaymentMethodPicker = ({ value, onChange }: PaymentMethodPickerProps) => (
  <fieldset>
    <legend className="sr-only">Payment method</legend>
    <div className="grid grid-cols-1 gap-3 xsmall:grid-cols-2">
      {PAYMENT_METHODS.map((method) => {
        const Icon = ICONS[method]
        const info = PAYMENT_METHOD_INFO[method]
        const selected = value === method

        return (
          <label
            key={method}
            className={clx(
              "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-500",
              selected
                ? "border-brand-600 bg-brand-50"
                : "border-grey-20 hover:border-brand-300"
            )}
            data-testid={`payment-method-${method}`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method}
              checked={selected}
              onChange={() => onChange(method)}
              className="mt-1 h-4 w-4 shrink-0 accent-brand-600"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 font-medium text-navy-900">
                <Icon
                  className={clx(
                    "shrink-0",
                    selected ? "text-brand-600" : "text-grey-50"
                  )}
                />
                {info.label}
              </span>
              <span className="mt-0.5 block text-xs text-grey-50">
                {info.description}
                {getPaymentFee(method) > 0 &&
                  ` (+${formatPrice(getPaymentFee(method))} fee)`}
              </span>
            </span>
          </label>
        )
      })}
    </div>
    <p className="mt-4 rounded-lg bg-warning-50 px-3 py-2 text-xs text-warning-600">
      Demo store — no real payment is taken.
    </p>
  </fieldset>
)

export default PaymentMethodPicker
