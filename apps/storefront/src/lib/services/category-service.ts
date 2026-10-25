import "server-only"

import { cache } from "react"

import { catalogRepository } from "@lib/catalog/repositories"

export const listCategories = cache(() => catalogRepository.listCategories())

export const getCategoryBySlug = cache((slug: string) =>
  catalogRepository.getCategoryBySlug(slug)
)

export async function getCategoryById(id: string) {
  const categories = await listCategories()
  return categories.find((c) => c.id === id) ?? null
}
