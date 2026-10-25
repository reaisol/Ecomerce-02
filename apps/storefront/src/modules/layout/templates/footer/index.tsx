import { Clock, Envelope, MapPin, Phone } from "@medusajs/icons"
import type { ReactNode } from "react"

import { brand } from "@lib/brand"
import { listCategories } from "@lib/services/category-service"
import BrandLogo from "@modules/common/components/brand-logo"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PaymentMethods from "@modules/layout/components/payment-methods"
import { HELP_LINKS, TRACK_ORDER_LINK } from "@modules/layout/lib/site-links"

const CUSTOMER_CARE_LINKS = [TRACK_ORDER_LINK, ...HELP_LINKS]

export default async function Footer() {
  const categories = await listCategories()

  const shopLinks = [
    ...categories.map((c) => ({
      label: c.name,
      href: `/categories/${c.slug}`,
    })),
    { label: "All products", href: "/store" },
    { label: "Today's deals", href: "/store?sale=1" },
  ]

  return (
    <footer className="bg-navy-900 text-white/70">
      <div className="content-container grid gap-10 py-12 small:grid-cols-[1.4fr_1fr_1fr_1.3fr] small:gap-12 small:py-16">
        <div className="max-w-sm">
          <LocalizedClientLink href="/" aria-label={`${brand.name} home`}>
            <BrandLogo variant="light" />
          </LocalizedClientLink>
          <p className="mt-4 text-sm leading-6">{brand.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 small:contents">
          <FooterColumn title="Shop">
            {shopLinks.map((link) => (
              <FooterLink key={link.href} {...link} />
            ))}
          </FooterColumn>
          <FooterColumn title="Customer care">
            {CUSTOMER_CARE_LINKS.map((link) => (
              <FooterLink key={link.label} {...link} />
            ))}
          </FooterColumn>
        </div>

        <FooterColumn title="Contact us">
          <ContactItem icon={<Phone />}>
            <a
              href={`tel:${brand.contact.phone.replace(/\s+/g, "")}`}
              className="hover:text-white"
            >
              {brand.contact.phone}
            </a>
          </ContactItem>
          <ContactItem icon={<Envelope />}>
            <a
              href={`mailto:${brand.contact.email}`}
              className="hover:text-white"
            >
              {brand.contact.email}
            </a>
          </ContactItem>
          <ContactItem icon={<Clock />}>{brand.contact.hours}</ContactItem>
          <ContactItem icon={<MapPin />}>{brand.contact.address}</ContactItem>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="content-container flex flex-col gap-4 py-6 small:flex-row small:items-center small:justify-between">
          <PaymentMethods />
          <p className="text-xs text-white/60">
            &copy; {new Date().getFullYear()} {brand.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

const FooterColumn = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <div>
    <h2 className="mb-4 font-display text-sm font-bold text-white">{title}</h2>
    <ul className="space-y-3 text-sm">{children}</ul>
  </div>
)

const FooterLink = ({ label, href }: { label: string; href: string }) => (
  <li>
    <LocalizedClientLink
      href={href}
      className="transition-colors hover:text-white"
    >
      {label}
    </LocalizedClientLink>
  </li>
)

const ContactItem = ({
  icon,
  children,
}: {
  icon: ReactNode
  children: ReactNode
}) => (
  <li className="flex items-start gap-3">
    <span className="mt-0.5 shrink-0 text-brand-300" aria-hidden="true">
      {icon}
    </span>
    <span className="leading-5">{children}</span>
  </li>
)
