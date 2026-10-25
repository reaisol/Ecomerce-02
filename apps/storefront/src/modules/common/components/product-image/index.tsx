"use client"

import Image from "next/image"
import { useState } from "react"

import { clx } from "@modules/common/components/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ProductImageProps = {
  src?: string
  alt: string
  sizes?: string
  priority?: boolean
  className?: string
}

/** Fills its (relatively positioned) parent; shows a neutral placeholder when the image is missing or fails to load. */
const ProductImage = ({
  src,
  alt,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority,
  className,
}: ProductImageProps) => {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-surface-subtle text-grey-40"
        role="img"
        aria-label={alt}
      >
        <PlaceholderImage size={32} />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      draggable={false}
      onError={() => setFailed(true)}
      className={clx("object-cover object-center", className)}
    />
  )
}

export default ProductImage
