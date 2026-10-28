import "server-only"

import { MedusaCatalogRepository } from "./medusa"
import type { CatalogRepository } from "./types"

/**
 * Medusa is the only catalog source. Products and categories are managed
 * in the backend admin; no local JSON fallback is used.
 */
const repositories: Record<string, () => CatalogRepository> = {
  medusa: () =>
    new MedusaCatalogRepository({
      baseUrl:
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000",
      publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      regionId: process.env.MEDUSA_REGION_ID || undefined,
    }),
}

const source = "medusa"

if (!repositories[source]) {
  throw new Error(
    `Unknown CATALOG_DATA_SOURCE "${source}". Expected one of: ${Object.keys(
      repositories,
    ).join(", ")}`,
  )
}

export const catalogRepository: CatalogRepository = repositories[source]()
