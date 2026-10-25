"use client"

import { useParams } from "next/navigation"

import { commerce } from "@lib/brand"

/**
 * Current country segment of the URL. Routes rendered outside `[countryCode]`
 * (such as the root 404) fall back to the store's country.
 */
export function useCountryCode() {
  return (
    useParams<{ countryCode: string }>()?.countryCode ?? commerce.countryCode
  )
}
