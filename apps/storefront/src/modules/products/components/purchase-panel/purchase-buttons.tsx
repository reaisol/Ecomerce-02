"use client"

import { Bolt, ShoppingCart } from "@medusajs/icons"

import { Button } from "@modules/common/components/ui"

type PurchaseButtonsProps = {
  canBuy: boolean
  onAddToCart: () => void
  onBuyNow: () => void
}

const PurchaseButtons = ({ canBuy, onAddToCart, onBuyNow }: PurchaseButtonsProps) => (
  <div className="grid grid-cols-1 gap-3 xsmall:grid-cols-2">
    <Button
      size="large"
      onClick={onAddToCart}
      disabled={!canBuy}
      className="w-full"
      data-testid="add-to-cart-button"
    >
      <ShoppingCart aria-hidden />
      {canBuy ? "Add to cart" : "Out of stock"}
    </Button>
    <Button
      size="large"
      variant="secondary"
      onClick={onBuyNow}
      disabled={!canBuy}
      className="w-full"
      data-testid="buy-now-button"
    >
      <Bolt aria-hidden />
      Buy now
    </Button>
  </div>
)

export default PurchaseButtons
