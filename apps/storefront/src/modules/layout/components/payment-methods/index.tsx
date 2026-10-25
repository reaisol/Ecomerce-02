import { clx } from "@modules/common/components/ui"

const PAYMENT_METHODS = [
  "UPI",
  "Visa",
  "Mastercard",
  "RuPay",
  "Net banking",
  "Cash on delivery",
]

const PaymentMethods = ({ className }: { className?: string }) => (
  <ul
    aria-label="Accepted payment methods"
    className={clx("flex flex-wrap gap-2", className)}
  >
    {PAYMENT_METHODS.map((method) => (
      <li
        key={method}
        className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/80"
      >
        {method}
      </li>
    ))}
  </ul>
)

export default PaymentMethods
