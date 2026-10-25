import { brand } from "@lib/brand"
import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "styles/globals.css"

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: `${brand.name} | ${brand.tagline}`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  openGraph: { siteName: brand.name, images: [brand.logo.full] },
}

export const viewport: Viewport = {
  themeColor: "#006DB0",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      data-mode="light"
      className={`${sans.variable} ${display.variable}`}
    >
      <body className="bg-surface-muted font-sans text-navy-900 antialiased">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
