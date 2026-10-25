import { Metadata } from "next"

import CartTemplate from "@modules/cart/templates"

export const metadata: Metadata = {
  title: "Cart",
  description: "Review the items in your cart and proceed to secure checkout.",
}

export default function CartPage() {
  return <CartTemplate />
}
