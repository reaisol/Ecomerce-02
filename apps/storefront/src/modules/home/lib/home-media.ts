/**
 * Editorial imagery for the homepage, kept apart from catalog data so
 * merchandising visuals can change without touching products. Images are
 * served from /public/images/home; the suit portrait was supplied by the user.
 * The remaining photos are CC0 (StockSnap / rawpixel).
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
    image: "/images/home/suitings-shirtings.jpeg",
    alt: "Man wearing a navy suit jacket and white shirt",
    label: "Suitings and Shirtings",
    caption: "Suits and shirts for a refined look",
    href: "/store",
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
