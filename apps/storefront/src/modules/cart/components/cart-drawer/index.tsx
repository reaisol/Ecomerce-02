"use client"

import { XMark } from "@medusajs/icons"
import { usePathname } from "next/navigation"
import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react"

import { useCart } from "@lib/cart/cart-store"
import { formatPrice } from "@lib/util/format-price"
import CartItem from "@modules/cart/components/cart-item"
import EmptyCart from "@modules/cart/components/empty-cart"
import FreeShippingProgress from "@modules/cart/components/free-shipping-progress"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

const linkButtonClass =
  "inline-flex h-12 w-full items-center justify-center rounded-xl text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"

const CartDrawer = () => {
  const { lines, totals, isDrawerOpen, isReady, closeDrawer } = useCart()
  const pathname = usePathname()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeDrawer()
  }, [pathname, closeDrawer])

  useEffect(() => {
    if (!isDrawerOpen) return

    const previouslyFocused = document.activeElement as HTMLElement | null
    const { overflow } = document.body.style
    document.body.style.overflow = "hidden"
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = overflow
      previouslyFocused?.focus?.()
    }
  }, [isDrawerOpen])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      closeDrawer()
      return
    }
    if (event.key !== "Tab" || !panelRef.current) return

    const focusable = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    )
    if (!focusable.length) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  // Links to the current page do not change the pathname, so close on any link click too.
  const handlePanelClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) closeDrawer()
  }

  const isEmpty = isReady && lines.length === 0

  return (
    <div
      className={clx(
        "fixed inset-0 z-50",
        isDrawerOpen ? "visible" : "invisible pointer-events-none"
      )}
      aria-hidden={!isDrawerOpen}
      inert={!isDrawerOpen}
    >
      <div
        className={clx(
          "absolute inset-0 bg-navy-900/40 transition-opacity duration-300",
          isDrawerOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={closeDrawer}
        data-testid="cart-drawer-overlay"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        onKeyDown={handleKeyDown}
        onClick={handlePanelClick}
        className={clx(
          "absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-card-hover transition-transform duration-300 ease-out xsmall:max-w-md",
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        )}
        data-testid="cart-drawer"
      >
        <header className="flex items-center justify-between border-b border-grey-10 px-4 py-4 xsmall:px-6">
          <h2
            id="cart-drawer-title"
            className="font-display text-lg font-bold text-navy-900"
          >
            Your cart
            {totals.itemCount > 0 && (
              <span className="ml-2 text-sm font-medium text-grey-50">
                ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-navy-900 transition-colors hover:bg-surface-subtle"
            aria-label="Close cart"
            data-testid="cart-drawer-close"
          >
            <XMark />
          </button>
        </header>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyCart
              variant="inline"
              description="Browse our essentials and add something you like."
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 xsmall:px-6">
              {totals.itemCount > 0 && (
                <FreeShippingProgress
                  amountRemaining={totals.amountToFreeShipping}
                  className="mt-4"
                />
              )}
              <ul className="divide-y divide-grey-10">
                {lines.map((line) => (
                  <CartItem key={line.id} line={line} size="compact" />
                ))}
              </ul>
            </div>

            <footer className="border-t border-grey-10 px-4 pb-6 pt-4 xsmall:px-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-grey-60">Subtotal</span>
                <span
                  className="text-lg font-bold text-navy-900 tabular-nums"
                  data-testid="cart-drawer-subtotal"
                >
                  {formatPrice(totals.subtotal)}
                </span>
              </div>
              {totals.savings > 0 && (
                <p className="mt-0.5 text-right text-xs font-medium text-success-700">
                  You save {formatPrice(totals.savings)}
                </p>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <LocalizedClientLink
                  href="/cart"
                  className={clx(
                    linkButtonClass,
                    "border border-grey-20 bg-white text-navy-900 hover:border-brand-300 hover:bg-brand-50"
                  )}
                >
                  View cart
                </LocalizedClientLink>
                <LocalizedClientLink
                  href="/checkout"
                  className={clx(
                    linkButtonClass,
                    "bg-brand-600 text-white hover:bg-brand-700"
                  )}
                  data-testid="cart-drawer-checkout"
                >
                  Checkout
                </LocalizedClientLink>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
