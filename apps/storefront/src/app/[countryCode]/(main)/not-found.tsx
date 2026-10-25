import { Metadata } from "next"

import NotFoundContent from "@modules/layout/components/not-found-content"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return <NotFoundContent />
}
