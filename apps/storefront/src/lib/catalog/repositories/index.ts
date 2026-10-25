import "server-only"

import { MedusaCatalogRepository } from "./medusa"
import { MockCatalogRepository } from "./mock"
import type { CatalogRepository } from "./types"

/**
 * Selects the catalog data source from `CATALOG_DATA_SOURCE`:
 * - `mock` (default) serves the bundled JSON catalog in `src/data`
 * - `medusa` reads the Medusa Store API (see `../README.md`)
 */
const repositories: Record<string, () => CatalogRepository> = {
  mock: () => new MockCatalogRepository(),
  medusa: () =>
    new MedusaCatalogRepository({
      baseUrl:
        process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000",
      publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      regionId: process.env.MEDUSA_REGION_ID || undefined,
    }),
}

const source = process.env.CATALOG_DATA_SOURCE ?? "mock"

if (!repositories[source]) {
  throw new Error(
    `Unknown CATALOG_DATA_SOURCE "${source}". Expected one of: ${Object.keys(
      repositories
    ).join(", ")}`
  )
}

export const catalogRepository: CatalogRepository = repositories[source]()
