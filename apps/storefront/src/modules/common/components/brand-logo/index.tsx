import Image from "next/image"

import { brand } from "@lib/brand"
import { clx } from "@modules/common/components/ui"

type BrandLogoProps = {
  /** "light" is for dark backgrounds such as the footer. */
  variant?: "dark" | "light"
  className?: string
}

const WORDMARK_ACCENT_LENGTH = 3

/**
 * Horizontal lockup of the logo: the bag mark plus the wordmark, with the
 * first letters in brand blue as in the official artwork ("tru" + "shop").
 */
const BrandLogo = ({ variant = "dark", className }: BrandLogoProps) => {
  const accent = brand.name.slice(0, WORDMARK_ACCENT_LENGTH)
  const rest = brand.name.slice(WORDMARK_ACCENT_LENGTH)

  return (
    <span className={clx("inline-flex items-center gap-2", className)}>
      {/* The mark's white check blends into dark surfaces, so it sits on a white tile there. */}
      <span
        className={clx(
          "relative h-9 w-9 shrink-0 small:h-10 small:w-10",
          variant === "light" && "rounded-lg bg-white p-1"
        )}
      >
        <span className="relative block h-full w-full">
          <Image
            src={brand.logo.mark}
            alt=""
            fill
            sizes="40px"
            priority
            className="object-contain"
          />
        </span>
      </span>
      <span
        className="font-display text-[22px] font-extrabold lowercase leading-none tracking-tight whitespace-nowrap small:text-2xl"
        aria-label={brand.logo.alt}
      >
        <span className={variant === "light" ? "text-brand-300" : "text-brand-600"}>
          {accent}
        </span>
        <span className={variant === "light" ? "text-white" : "text-navy-900"}>
          {rest}
        </span>
      </span>
    </span>
  )
}

export default BrandLogo
