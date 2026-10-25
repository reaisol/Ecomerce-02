import { ArrowRight } from "@medusajs/icons"
import Image from "next/image"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { heroTiles, type HomeTile } from "@modules/home/lib/home-media"

/** One large and two small editorial tiles linking into the store. */
const HeroCollage = () => {
  const [lead, ...rest] = heroTiles

  return (
    <div className="grid h-72 grid-cols-[1.5fr_1fr] grid-rows-2 gap-3 xsmall:h-96 small:h-[460px] small:gap-4">
      <CollageTile tile={lead} className="row-span-2" featured />
      {rest.map((tile) => (
        <CollageTile key={tile.href} tile={tile} />
      ))}
    </div>
  )
}

const CollageTile = ({
  tile,
  className,
  featured,
}: {
  tile: HomeTile
  className?: string
  featured?: boolean
}) => (
  <LocalizedClientLink
    href={tile.href}
    className={clx(
      "group relative overflow-hidden rounded-2xl bg-white shadow-card-hover",
      className
    )}
  >
    <Image
      src={tile.image}
      alt={tile.alt}
      fill
      priority
      sizes={featured ? "(max-width: 1024px) 60vw, 32vw" : "(max-width: 1024px) 40vw, 20vw"}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
    />
    <span
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent"
    />
    <span className="absolute inset-x-3 bottom-3 small:inset-x-4 small:bottom-4">
      <span
        className={clx(
          "block font-display font-bold leading-tight text-white",
          featured ? "text-lg small:text-2xl" : "text-sm small:text-base"
        )}
      >
        {tile.label}
      </span>
      {featured && (
        <span className="mt-1 hidden text-sm text-white/85 xsmall:block">
          {tile.caption}
        </span>
      )}
      <span
        className={clx(
          "mt-2 inline-flex items-center gap-1 font-semibold text-white",
          featured
            ? "rounded-lg bg-white/15 px-3 py-1.5 text-sm backdrop-blur-sm group-hover:bg-white/25"
            : "text-xs"
        )}
      >
        Shop now
        <ArrowRight
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </span>
  </LocalizedClientLink>
)

export default HeroCollage
