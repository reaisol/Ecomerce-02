import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonRelatedProducts = () => (
  <div className="animate-pulse" aria-hidden>
    <div className="mb-6 h-7 w-56 rounded bg-grey-10" />
    <ul className="grid grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-4 small:gap-5">
      {repeat(4).map((index) => (
        <li key={index}>
          <SkeletonProductPreview />
        </li>
      ))}
    </ul>
  </div>
)

export default SkeletonRelatedProducts
