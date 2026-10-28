import "server-only"

import { cache } from "react"

import { catalogRepository } from "@lib/catalog/repositories"

export const listCategories = cache(async () => {
  try {
    return await catalogRepository.listCategories()
  } catch (error) {
    console.warn("Failed to load categories during build or request:", error)
    return []
  }
})

export const getCategoryBySlug = cache(async (slug: string) => {
  try {
    return await catalogRepository.getCategoryBySlug(slug)
  } catch (error) {
    console.warn(`Failed to get category by slug "${slug}":`, error)
    return null
  }
})

export async function getCategoryById(id: string) {
  const categories = await listCategories()
  return categories.find((c) => c.id === id) ?? null
}
