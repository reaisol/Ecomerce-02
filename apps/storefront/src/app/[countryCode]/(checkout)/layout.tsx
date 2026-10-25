import { ChevronLeft, LockClosedSolid } from "@medusajs/icons"

import { brand } from "@lib/brand"
import BrandLogo from "@modules/common/components/brand-logo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-muted">
      <header className="border-b border-grey-10 bg-white">
        <nav className="content-container flex h-16 items-center justify-between gap-4">
          <LocalizedClientLink
            href="/cart"
            className="flex items-center gap-1 text-sm font-medium text-grey-60 hover:text-navy-900"
            data-testid="back-to-cart-link"
          >
            <ChevronLeft aria-hidden />
            <span className="hidden xsmall:inline">Back to cart</span>
            <span className="xsmall:hidden">Cart</span>
          </LocalizedClientLink>
          <LocalizedClientLink href="/" aria-label={`${brand.name} home`}>
            <BrandLogo />
          </LocalizedClientLink>
          <p className="flex items-center gap-1.5 text-sm font-medium text-success-700">
            <LockClosedSolid aria-hidden />
            <span className="hidden xsmall:inline">Secure checkout</span>
            <span className="xsmall:hidden">Secure</span>
          </p>
        </nav>
      </header>

      <main className="flex-1" data-testid="checkout-container">
        {children}
      </main>

      <footer className="border-t border-grey-10 bg-white">
        <div className="content-container flex flex-col items-center justify-between gap-2 py-5 text-xs text-grey-50 xsmall:flex-row">
          <p>
            © {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
          <p>
            Need help?{" "}
            <a href={`mailto:${brand.contact.email}`} className="text-brand-700 hover:underline">
              {brand.contact.email}
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
