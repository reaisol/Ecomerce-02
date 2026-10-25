import { ArrowRight } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type SectionHeadingProps = {
  title: string
  subtitle?: string
  eyebrow?: string
  action?: { label: string; href: string }
  className?: string
  /** Lets the surrounding section reference the title via aria-labelledby. */
  id?: string
}

const SectionHeading = ({
  title,
  subtitle,
  eyebrow,
  action,
  className,
  id,
}: SectionHeadingProps) => (
  <div
    className={clx(
      "mb-5 flex items-end justify-between gap-4 small:mb-7",
      className
    )}
  >
    <div className="min-w-0">
      {eyebrow && (
        <p className="mb-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-600">
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className="font-display text-xl font-bold text-navy-900 small:text-2xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-grey-50 small:text-base">{subtitle}</p>
      )}
    </div>
    {action && (
      <LocalizedClientLink
        href={action.href}
        className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
      >
        {action.label}
        <ArrowRight />
      </LocalizedClientLink>
    )}
  </div>
)

export default SectionHeading
