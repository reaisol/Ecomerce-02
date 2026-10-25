/**
 * Single source of truth for store identity; every surface reads from here.
 * Colors in tailwind.config.js (`brand`, `navy`) are sampled from the logo.
 */
export const brand = {
  name: "trushop",
  tagline: "Smart products. Better prices.",
  description:
    "Kitchen, storage, cleaning and home utility essentials, plus everyday tools, at honest prices delivered across India.",
  logo: {
    /** Bag icon on a transparent background; the wordmark is rendered as text beside it. */
    mark: "/brand/trushop-mark.png",
    /** Full stacked logo (icon above "trushop.com"), used as the default share image. */
    full: "/brand/trushop-logo.png",
    alt: "trushop",
  },
  contact: {
    email: "support@trushop.com",
    phone: "+91 98765 43210",
    hours: "Mon–Sat, 9:00 AM – 7:00 PM IST",
    address: "Shop No. 12, Main Market Road, Hyderabad, Telangana 500001",
  },
} as const

export const commerce = {
  currency: "INR",
  locale: "en-IN",
  countryCode: "in",
  freeShippingThreshold: 499,
  standardShippingFee: 49,
  codFee: 25,
} as const
