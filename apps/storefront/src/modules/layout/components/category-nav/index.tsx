"use client"

import { usePathname } from "next/navigation"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import type { NavCategory } from "@modules/layout/types/nav-category"

const linkClass =
  "relative flex h-full items-center whitespace-nowrap text-sm font-medium transition-colors hover:text-brand-700"

const CategoryNav = ({ categories }: { categories: NavCategory[] }) => {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Product categories"
      className="hidden border-t border-grey-10 small:block"
    >
      <ul className="content-container flex h-12 items-center gap-8">
        <li className="h-full">
          <LocalizedClientLink
            href="/store"
            className={clx(linkClass, "font-semibold text-navy-900")}
          >
            All products
          </LocalizedClientLink>
        </li>
        {categories.map((category) => {
          const isActive = pathname.endsWith(`/categories/${category.slug}`)
          return (
            <li key={category.id} className="h-full">
              <LocalizedClientLink
                href={`/categories/${category.slug}`}
                aria-current={isActive ? "page" : undefined}
                className={clx(
                  linkClass,
                  isActive
                    ? "text-brand-700 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600"
                    : "text-grey-70"
                )}
              >
                {category.name}
              </LocalizedClientLink>
            </li>
          )
        })}
        <li className="ml-auto h-full">
          <LocalizedClientLink
            href="/store?sale=1"
            className={clx(
              linkClass,
              "font-semibold text-danger-600 hover:text-danger-600/80"
            )}
          >
            Deals
          </LocalizedClientLink>
        </li>
      </ul>
    </nav>
  )
}

export default CategoryNav
