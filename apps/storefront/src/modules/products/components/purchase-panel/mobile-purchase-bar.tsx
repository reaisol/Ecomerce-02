"use client"

import { ShoppingCart } from "@medusajs/icons"
import { useEffect, useState, type RefObject } from "react"

import PriceDisplay from "@modules/products/components/price-display"
import { clx } from "@modules/common/components/ui"

type MobilePurchaseBarProps = {
  /** The in-page buttons; the bar appears once they scroll out of view above. */
  anchorRef: RefObject<HTMLElement | null>
  price: number
  compareAtPrice?: number
  canBuy: boolean
  onAddToCart: () => void
}

const MobilePurchaseBar = ({
  anchorRef,
  price,
  compareAtPrice,
  canBuy,
  onAddToCart,
}: MobilePurchaseBarProps) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const anchor = anchorRef.current
    if (!anchor) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(anchor)
    return () => observer.disconnect()
  }, [anchorRef])

  return (
    <div
      className={clx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-grey-10 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-4px_16px_rgba(16,24,40,0.08)] backdrop-blur transition-transform duration-200 small:hidden",
        isVisible ? "translate-y-0" : "pointer-events-none translate-y-full"
      )}
      aria-hidden={!isVisible}
      data-testid="mobile-purchase-bar"
    >
      <div className="flex items-center gap-3">
        <PriceDisplay
          price={price}
          compareAtPrice={compareAtPrice}
          size="md"
          className="min-w-0 flex-1"
        />
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!canBuy}
          tabIndex={isVisible ? 0 : -1}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-grey-30"
        >
          <ShoppingCart aria-hidden />
          {canBuy ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  )
}

export default MobilePurchaseBar
