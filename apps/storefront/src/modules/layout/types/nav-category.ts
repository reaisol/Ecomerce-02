import type { Category } from "@lib/catalog/types"

/** The slice of a category the navigation needs; keeps client props small. */
export type NavCategory = Pick<Category, "id" | "slug" | "name">

export const toNavCategory = ({ id, slug, name }: Category): NavCategory => ({
  id,
  slug,
  name,
})
