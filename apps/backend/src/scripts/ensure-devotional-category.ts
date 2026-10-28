import type { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

export default async function ensureDevotionalCategory({
  container,
}: ExecArgs) {
  const products = container.resolve(Modules.PRODUCT)
  const existing = await products.listProductCategories({
    handle: "devotional",
  })
  if (existing.length) {
    await products.updateProductCategories(existing[0].id, {
      is_active: true,
      is_internal: false,
    })
    console.log("Devotional category already exists and is public.")
    return
  }
  await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        {
          name: "Devotional",
          handle: "devotional",
          description: "Explore our devotional collection.",
          is_active: true,
          is_internal: false,
        },
      ],
    },
  })
  console.log("Created public Devotional category.")
}
