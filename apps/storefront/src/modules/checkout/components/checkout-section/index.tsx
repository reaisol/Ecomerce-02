type CheckoutSectionProps = {
  step: number
  title: string
  description?: string
  children: React.ReactNode
}

const CheckoutSection = ({
  step,
  title,
  description,
  children,
}: CheckoutSectionProps) => {
  const headingId = `checkout-step-${step}`

  return (
    <section
      className="rounded-2xl border border-grey-10 bg-white p-4 shadow-card xsmall:p-6"
      aria-labelledby={headingId}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
          {step}
        </span>
        <div>
          <h2
            id={headingId}
            className="font-display text-lg font-bold text-navy-900"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-grey-50">{description}</p>
          )}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export default CheckoutSection
