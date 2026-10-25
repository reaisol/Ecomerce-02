import { ChevronRight } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

export type BreadcrumbItem = {
  label: string
  /** Omitted for the current page. */
  href?: string
}

const Breadcrumbs = ({
  items,
  className,
}: {
  items: BreadcrumbItem[]
  className?: string
}) => (
  <nav aria-label="Breadcrumb" className={clx("min-w-0", className)}>
    <ol className="flex min-w-0 items-center gap-1 text-xs text-grey-50 small:text-sm">
      {items.map((item, index) => (
        <li
          key={`${item.label}-${index}`}
          className={clx("flex items-center gap-1", {
            "min-w-0": index === items.length - 1,
          })}
        >
          {index > 0 && (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-grey-40" aria-hidden />
          )}
          {item.href ? (
            <LocalizedClientLink
              href={item.href}
              className="whitespace-nowrap hover:text-brand-700"
            >
              {item.label}
            </LocalizedClientLink>
          ) : (
            <span aria-current="page" className="truncate font-medium text-navy-900">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)

export default Breadcrumbs
