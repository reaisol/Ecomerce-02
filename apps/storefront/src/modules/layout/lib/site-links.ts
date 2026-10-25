/** Store-wide links shared by the header menu, footer and 404 page. */

export const TRACK_ORDER_LINK = { label: "Track order", href: "/account" }

export const ACCOUNT_LINKS = [
  { label: "My account", href: "/account" },
  TRACK_ORDER_LINK,
  { label: "Cart", href: "/cart" },
] as const

export const HELP_LINKS = [
  { label: "Shipping & delivery", href: "/help#shipping" },
  { label: "Returns & refunds", href: "/help#returns" },
  { label: "Payments", href: "/help#payments" },
  { label: "Contact us", href: "/help#contact" },
] as const
