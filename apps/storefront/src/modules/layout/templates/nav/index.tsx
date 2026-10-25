import { User } from "@medusajs/icons"

import { brand } from "@lib/brand"
import { listCategories } from "@lib/services/category-service"
import BrandLogo from "@modules/common/components/brand-logo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import CategoryNav from "@modules/layout/components/category-nav"
import SearchForm from "@modules/layout/components/search-form"
import SideMenu from "@modules/layout/components/side-menu"
import TopBar from "@modules/layout/components/top-bar"
import { toNavCategory } from "@modules/layout/types/nav-category"

export default async function Nav() {
  const categories = (await listCategories()).map(toNavCategory)

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 bg-white shadow-header">
        <div className="content-container">
          <div className="flex h-16 items-center gap-2 xsmall:gap-4 small:h-[72px] small:gap-8">
            <SideMenu categories={categories} />
            <LocalizedClientLink
              href="/"
              aria-label={`${brand.name} home`}
              className="shrink-0"
              data-testid="nav-store-link"
            >
              <BrandLogo />
            </LocalizedClientLink>
            <SearchForm
              id="header-search"
              className="hidden max-w-2xl flex-1 xsmall:block"
            />
            <div className="ml-auto flex items-center gap-1">
              <LocalizedClientLink
                href="/account"
                aria-label="Account"
                className="flex h-11 items-center gap-2 rounded-xl px-2.5 text-navy-900 transition-colors hover:bg-brand-50 hover:text-brand-700 small:px-3"
                data-testid="nav-account-link"
              >
                <User className="h-6 w-6" />
                <span className="hidden text-sm font-semibold small:inline">
                  Account
                </span>
              </LocalizedClientLink>
              <CartButton />
            </div>
          </div>
          <div className="pb-3 xsmall:hidden">
            <SearchForm id="header-search-mobile" />
          </div>
        </div>
        <CategoryNav categories={categories} />
      </header>
    </>
  )
}
