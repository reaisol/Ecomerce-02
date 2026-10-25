"use client"

import { useParams, usePathname, useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { cartActions } from "@lib/cart/cart-store"
import { toCartLine } from "@lib/cart/to-cart-line"
import type { Product, ProductVariant } from "@lib/catalog/types"
import QuantitySelector from "@modules/common/components/quantity-selector"
import PriceDisplay from "@modules/products/components/price-display"
import StockStatus from "@modules/products/components/stock-status"
import VariantSelector from "@modules/products/components/variant-selector"
import { hasSelectableOptions } from "@modules/products/lib/variant-selection"

import MobilePurchaseBar from "./mobile-purchase-bar"
import PurchaseButtons from "./purchase-buttons"

type PurchasePanelProps = {
  product: Product
  initialVariant: ProductVariant
}

const PurchasePanel = ({ product, initialVariant }: PurchasePanelProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const { countryCode } = useParams<{ countryCode: string }>()
  const [variant, setVariant] = useState(initialVariant)
  const [quantity, setQuantity] = useState(1)
  const actionsRef = useRef<HTMLDivElement>(null)
  const showOptions = hasSelectableOptions(product)
  const canBuy = variant.stock > 0

  const selectVariant = (next: ProductVariant) => {
    setVariant(next)
    setQuantity(1)
    // Shallow URL update keeps the selection shareable without a server round trip.
    const params = new URLSearchParams(window.location.search)
    params.set("variant", next.id)
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`)
  }

  const addToCart = (openDrawer = true) =>
    cartActions.addItem(toCartLine(product, variant), quantity, openDrawer)

  const buyNow = () => {
    addToCart(false)
    router.push(`/${countryCode}/checkout`)
  }

  return (
    <div className="flex flex-col gap-5" data-testid="purchase-panel">
      <div>
        <PriceDisplay
          price={variant.price}
          compareAtPrice={variant.compareAtPrice}
          size="lg"
        />
        <p className="mt-1 text-xs text-grey-50">Inclusive of all taxes</p>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <StockStatus stock={variant.stock} />
        <span className="text-xs text-grey-50" data-testid="variant-sku">
          SKU: {variant.sku}
        </span>
      </div>

      {showOptions && (
        <VariantSelector product={product} selected={variant} onSelect={selectVariant} />
      )}

      <div ref={actionsRef} className="flex flex-col gap-3">
        {canBuy && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-grey-60">Quantity</span>
            <QuantitySelector
              value={quantity}
              max={variant.stock}
              onChange={setQuantity}
            />
          </div>
        )}
        <PurchaseButtons
          canBuy={canBuy}
          onAddToCart={() => addToCart()}
          onBuyNow={buyNow}
        />
      </div>

      <MobilePurchaseBar
        anchorRef={actionsRef}
        price={variant.price}
        compareAtPrice={variant.compareAtPrice}
        canBuy={canBuy}
        onAddToCart={() => addToCart()}
      />
    </div>
  )
}

export default PurchasePanel
