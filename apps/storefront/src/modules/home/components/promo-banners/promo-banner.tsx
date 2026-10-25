import { ArrowRight } from "@medusajs/icons"

import type { ProductImage as CatalogImage } from "@lib/catalog/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductImage from "@modules/common/components/product-image"
import { clx } from "@modules/common/components/ui"

type PromoBannerProps = {
  tone: "dark" | "light"
  eyebrow: string
  title: string
  description: string
  href: string
  image?: CatalogImage
}

const PromoBanner = ({
  tone,
  eyebrow,
  title,
  description,
  href,
  image,
}: PromoBannerProps) => {
  const isDark = tone === "dark"

  return (
    <LocalizedClientLink
      href={href}
      className={clx(
        "group grid min-h-[200px] grid-cols-[1fr_38%] overflow-hidden rounded-2xl transition-shadow hover:shadow-card-hover xsmall:min-h-[240px]",
        isDark
          ? "bg-navy-900 text-white"
          : "border border-brand-100 bg-brand-50 text-navy-900"
      )}
    >
      <div className="flex flex-col justify-center p-5 xsmall:p-8">
        <p
          className={clx(
            "mb-2 text-xs font-bold uppercase tracking-[0.12em]",
            isDark ? "text-brand-300" : "text-brand-700"
          )}
        >
          {eyebrow}
        </p>
        <h3 className="font-display text-xl font-extrabold leading-tight xsmall:text-2xl">
          {title}
        </h3>
        <p
          className={clx(
            "mt-2 text-sm",
            isDark ? "text-white/70" : "text-grey-60"
          )}
        >
          {description}
        </p>
        <span
          className={clx(
            "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold",
            isDark ? "text-white" : "text-brand-700"
          )}
        >
          Shop now
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <div className="relative">
        <ProductImage
          src={image?.url}
          alt={image?.alt ?? ""}
          sizes="(max-width: 1024px) 40vw, 20vw"
          className="transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>
    </LocalizedClientLink>
  )
}

export default PromoBanner
