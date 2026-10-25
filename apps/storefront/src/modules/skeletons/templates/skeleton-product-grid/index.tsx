import repeat from "@lib/util/repeat"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"

const SkeletonProductGrid = ({
  numberOfProducts = 8,
}: {
  numberOfProducts?: number
}) => (
  <ul
    className="grid grid-cols-2 gap-3 xsmall:gap-4 small:grid-cols-3 small:gap-5 large:grid-cols-4"
    data-testid="products-list-loader"
  >
    {repeat(numberOfProducts).map((index) => (
      <li key={index}>
        <SkeletonProductPreview />
      </li>
    ))}
  </ul>
)

export default SkeletonProductGrid
