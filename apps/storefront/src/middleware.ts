import { NextRequest, NextResponse } from "next/server"

import { commerce } from "@lib/brand"

/** Country segments the storefront serves. The store currently sells in India only. */
const SUPPORTED_COUNTRIES = new Set<string>([commerce.countryCode])

/**
 * Keeps every storefront URL prefixed with a supported country code,
 * e.g. `/store` → `/in/store`.
 */
export function middleware(request: NextRequest) {
  const { pathname, search, origin } = request.nextUrl

  if (pathname.includes(".")) {
    return NextResponse.next()
  }

  const firstSegment = pathname.split("/")[1]?.toLowerCase()

  if (firstSegment && SUPPORTED_COUNTRIES.has(firstSegment)) {
    return NextResponse.next()
  }

  const rest = pathname === "/" ? "" : pathname
  return NextResponse.redirect(
    `${origin}/${commerce.countryCode}${rest}${search}`,
    307
  )
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|brand|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
