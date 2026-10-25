import { Metadata } from "next"

import HelpTemplate from "@modules/help/templates"

export const metadata: Metadata = {
  title: "Help centre",
  description: "Shipping, returns, payments and contact information.",
}

export default function HelpPage() {
  return <HelpTemplate />
}
