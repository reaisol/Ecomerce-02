import { Metadata } from "next"

import CartDrawer from "@modules/cart/components/cart-drawer"
import NotFoundContent from "@modules/layout/components/not-found-content"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  title: "Page not found",
}

/** Unmatched URLs render outside the `[countryCode]` layout, so this page brings its own chrome. */
export default function NotFound() {
  return (
    <>
      <Nav />
      <NotFoundContent />
      <Footer />
      <CartDrawer />
    </>
  )
}
