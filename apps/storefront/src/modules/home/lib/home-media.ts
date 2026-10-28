/**
 * Editorial imagery for the homepage, kept apart from catalog data so
 * merchandising visuals can change without touching products. Images are
 * served from /public/images/home; the suit portrait was supplied by the user.
 * Other tiles use text until replacement photography is supplied.
 */

export type HomeTile = {
  image?: string
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
    alt: "Devotional",
    label: "Devotional",
    caption: "Explore our devotional collection",
    href: "/categories/devotional",
  },
  {
    alt: "Today's deals",
    label: "Today's deals",
    caption: "Big savings on daily-use products",
    href: "/store?sale=1",
  },
]
