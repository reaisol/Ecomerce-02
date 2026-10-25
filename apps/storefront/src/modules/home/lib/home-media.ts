/**
 * Editorial imagery for the homepage, kept apart from catalog data so
 * merchandising visuals can change without touching products. Photos are
 * CC0 (StockSnap / rawpixel) and served from /public/images/home.
 */

export type HomeTile = {
  image: string
  alt: string
  label: string
  caption: string
  href: string
}

export const heroTiles: [HomeTile, HomeTile, HomeTile] = [
  {
    image: "/images/home/kettle.jpg",
    alt: "Polished stainless steel kettle on a gas stove",
    label: "Kitchen essentials",
    caption: "Cookware, kettles and everyday tools",
    href: "/categories/kitchen-dining",
  },
  {
    image: "/images/home/toaster.jpg",
    alt: "White pop-up toaster with a slice of toast",
    label: "Home appliances",
    caption: "Smart helpers for busy mornings",
    href: "/categories/home-utility",
  },
  {
    image: "/images/home/blender.jpg",
    alt: "Blender jar filled with fresh oranges and strawberries",
    label: "Today's deals",
    caption: "Big savings on daily-use products",
    href: "/store?sale=1",
  },
]

export const promoImages = {
  kitchen: {
    url: "/images/home/skillet.jpg",
    alt: "Red cast iron skillet on a stove top",
  },
}
