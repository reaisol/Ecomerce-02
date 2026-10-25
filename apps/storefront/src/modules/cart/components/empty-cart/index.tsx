import { ShoppingCart } from "@medusajs/icons"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"

type EmptyCartProps = {
  /** "page" renders a standalone card with an h1; "inline" fits inside the cart drawer. */
  variant?: "page" | "inline"
  title?: string
  description?: string
}

const EmptyCart = ({
  variant = "page",
  title = "Your cart is empty",
  description = "Looks like you have not added anything yet. Explore our kitchen, storage, cleaning and home essentials.",
}: EmptyCartProps) => {
  const isPage = variant === "page"
  const Title = isPage ? "h1" : "p"

  return (
    <div
      className={clx(
        "flex flex-col items-center text-center",
        isPage
          ? "mx-auto max-w-md rounded-2xl border border-grey-10 bg-white px-6 py-14 shadow-card"
          : "px-6"
      )}
      data-testid="empty-cart"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <ShoppingCart className="h-7 w-7" aria-hidden />
      </span>
      <Title
        className={clx(
          "mt-5 font-display font-bold text-navy-900",
          isPage ? "text-2xl" : "text-lg"
        )}
      >
        {title}
      </Title>
      <p className="mt-2 text-sm text-grey-60">{description}</p>
      <LocalizedClientLink
        href="/store"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-brand-600 px-8 text-base font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        Start shopping
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCart
