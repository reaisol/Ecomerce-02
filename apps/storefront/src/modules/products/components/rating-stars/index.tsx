import { clx } from "@modules/common/components/ui"

type RatingStarsProps = {
  rating: number
  reviewCount?: number
  size?: "sm" | "md"
  className?: string
}

const STAR_PATH =
  "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"

const RatingStars = ({
  rating,
  reviewCount,
  size = "sm",
  className,
}: RatingStarsProps) => {
  const fillPercent = Math.max(0, Math.min(100, (rating / 5) * 100))
  const starSize = size === "sm" ? 14 : 18

  return (
    <div
      className={clx("flex items-center gap-1.5", className)}
      aria-label={`Rated ${rating.toFixed(1)} out of 5${
        reviewCount !== undefined ? ` from ${reviewCount} reviews` : ""
      }`}
    >
      <div className="relative flex" aria-hidden>
        <Stars size={starSize} className="text-grey-20" />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${fillPercent}%` }}
        >
          <Stars size={starSize} className="text-amber-400" />
        </div>
      </div>
      <span
        className={clx("font-semibold text-navy-900", {
          "text-xs": size === "sm",
          "text-sm": size === "md",
        })}
      >
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span
          className={clx("text-grey-50", {
            "text-xs": size === "sm",
            "text-sm": size === "md",
          })}
        >
          ({reviewCount.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  )
}

const Stars = ({ size, className }: { size: number; className: string }) => (
  <div className={clx("flex shrink-0", className)}>
    {Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="currentColor"
        className="shrink-0"
      >
        <path d={STAR_PATH} />
      </svg>
    ))}
  </div>
)

export default RatingStars
