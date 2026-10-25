"use client"

import { useRef, useState, type KeyboardEvent } from "react"

import type { ProductImage as ProductImageType } from "@lib/catalog/types"
import ProductImage from "@modules/common/components/product-image"
import { clx } from "@modules/common/components/ui"

import ImageCredit from "./image-credit"

type ImageGalleryProps = {
  images: ProductImageType[]
  productName: string
}

/**
 * The main viewer is a scroll-snap strip, so phones get native swiping while
 * thumbnails and arrow keys drive the same strip on larger screens.
 */
const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const viewerRef = useRef<HTMLDivElement>(null)
  const slides: (ProductImageType | undefined)[] = images.length ? images : [undefined]
  const activeCredit = slides[activeIndex]?.credit

  const goTo = (index: number) => {
    const viewer = viewerRef.current
    const target = Math.max(0, Math.min(index, slides.length - 1))
    setActiveIndex(target)
    viewer?.scrollTo({ left: target * viewer.clientWidth, behavior: "smooth" })
  }

  const onScroll = () => {
    const viewer = viewerRef.current
    if (!viewer || !viewer.clientWidth) return
    const index = Math.round(viewer.scrollLeft / viewer.clientWidth)
    if (index !== activeIndex) setActiveIndex(index)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      goTo(activeIndex + 1)
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      goTo(activeIndex - 1)
    }
  }

  return (
    <div className="min-w-0" data-testid="image-gallery">
      <div className="flex flex-col gap-3 small:flex-row-reverse">
        <div className="relative min-w-0 flex-1">
          <div
            ref={viewerRef}
            onScroll={onScroll}
            onKeyDown={onKeyDown}
            tabIndex={0}
            role="region"
            aria-roledescription="carousel"
            aria-label={`${productName} images`}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {slides.map((image, index) => (
              <div
                key={image?.url ?? "placeholder"}
                className="relative aspect-square w-full shrink-0 snap-center"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${slides.length}`}
              >
                <ProductImage
                  src={image?.url}
                  alt={image?.alt || productName}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          {slides.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-navy-900/70 px-2.5 py-1 text-xs font-semibold text-white small:hidden">
              {activeIndex + 1} / {slides.length}
            </span>
          )}
        </div>

        {images.length > 1 && (
          <ul
            className="no-scrollbar flex gap-2 overflow-x-auto small:max-h-[560px] small:w-20 small:shrink-0 small:flex-col small:overflow-y-auto small:overflow-x-visible"
            aria-label="Choose image"
          >
            {images.map((image, index) => (
              <li key={image.url} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Show image ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={clx(
                    "relative block h-16 w-16 overflow-hidden rounded-xl border-2 bg-white transition-colors small:h-20 small:w-20",
                    index === activeIndex
                      ? "border-brand-600"
                      : "border-transparent hover:border-grey-30"
                  )}
                >
                  <ProductImage src={image.url} alt="" sizes="80px" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeCredit && <ImageCredit credit={activeCredit} />}
    </div>
  )
}

export default ImageGallery
