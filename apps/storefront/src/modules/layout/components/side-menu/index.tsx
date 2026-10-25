"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import {
  BarsThree,
  ChevronRight,
  Envelope,
  Phone,
  Tag,
  XMark,
} from "@medusajs/icons"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { brand } from "@lib/brand"
import BrandLogo from "@modules/common/components/brand-logo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ACCOUNT_LINKS, HELP_LINKS } from "@modules/layout/lib/site-links"
import type { NavCategory } from "@modules/layout/types/nav-category"

type MenuLink = { label: string; href: string }

const SideMenu = ({ categories }: { categories: NavCategory[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const close = () => setIsOpen(false)

  // Covers navigations that don't come from a menu link (e.g. browser back).
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="-ml-2 flex h-11 w-11 items-center justify-center rounded-xl text-navy-900 transition-colors hover:bg-brand-50 small:hidden"
        data-testid="nav-menu-button"
      >
        <BarsThree className="h-6 w-6" />
      </button>

      <Dialog
        open={isOpen}
        onClose={close}
        className="relative z-[100] small:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-navy-900/50 transition-opacity duration-200 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="flex h-full w-[86%] max-w-[360px] flex-col bg-white shadow-xl transition-transform duration-200 ease-out data-[closed]:-translate-x-full"
            data-testid="nav-menu-popup"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-grey-10 px-4">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <LocalizedClientLink
                href="/"
                onClick={close}
                aria-label={`${brand.name} home`}
              >
                <BrandLogo />
              </LocalizedClientLink>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-grey-60 transition-colors hover:bg-surface-muted hover:text-navy-900"
                data-autofocus
                data-testid="close-menu-button"
              >
                <XMark className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <LocalizedClientLink
                href="/store?sale=1"
                onClick={close}
                className="mb-6 flex items-center gap-3 rounded-xl bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600"
              >
                <Tag />
                Today&apos;s deals
              </LocalizedClientLink>

              <MenuSection
                title="Shop by category"
                links={[
                  ...categories.map((c) => ({
                    label: c.name,
                    href: `/categories/${c.slug}`,
                  })),
                  { label: "All products", href: "/store" },
                ]}
                onNavigate={close}
              />
              <MenuSection
                title="Your account"
                links={ACCOUNT_LINKS}
                onNavigate={close}
              />
              <MenuSection title="Help" links={HELP_LINKS} onNavigate={close} />
            </div>

            <div className="space-y-2 border-t border-grey-10 bg-surface-muted px-4 py-4 text-sm text-grey-60">
              <a
                href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 hover:text-brand-700"
              >
                <Phone aria-hidden="true" />
                {brand.contact.phone}
              </a>
              <a
                href={`mailto:${brand.contact.email}`}
                className="flex items-center gap-2 hover:text-brand-700"
              >
                <Envelope aria-hidden="true" />
                {brand.contact.email}
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  )
}

const MenuSection = ({
  title,
  links,
  onNavigate,
}: {
  title: string
  links: readonly MenuLink[]
  onNavigate: () => void
}) => (
  <section className="mb-6 last:mb-0">
    <h3 className="mb-1 px-1 text-xs font-bold uppercase tracking-[0.1em] text-grey-50">
      {title}
    </h3>
    <ul>
      {links.map((link) => (
        <li key={link.label}>
          <LocalizedClientLink
            href={link.href}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-lg px-1 py-3 text-[15px] font-medium text-navy-900 transition-colors hover:text-brand-700"
          >
            {link.label}
            <ChevronRight className="text-grey-40" />
          </LocalizedClientLink>
        </li>
      ))}
    </ul>
  </section>
)

export default SideMenu
