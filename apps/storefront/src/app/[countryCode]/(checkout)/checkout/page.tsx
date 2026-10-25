import { Metadata } from "next"

import CheckoutForm from "@modules/checkout/templates/checkout-form"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Enter your delivery details and place your order securely.",
}

export default function CheckoutPage() {
  return <CheckoutForm />
}
