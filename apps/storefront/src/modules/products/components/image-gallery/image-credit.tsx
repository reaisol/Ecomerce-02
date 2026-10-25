import type { ImageCredit as ImageCreditType } from "@lib/catalog/types"

/** Attribution for openly licensed photos, as their licences require. */
const ImageCredit = ({ credit }: { credit: ImageCreditType }) => (
  <p className="mt-2 text-[11px] leading-4 text-grey-40" data-testid="image-credit">
    Photo: {credit.author} ·{" "}
    <a
      href={credit.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="underline underline-offset-2 hover:text-grey-60"
    >
      {credit.license}
    </a>
  </p>
)

export default ImageCredit
