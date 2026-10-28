import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  updateRegionsWorkflow,
  updateStoresWorkflow,
  updateServiceZonesWorkflow,
} from "@medusajs/medusa/core-flows"

// Explicitly approved demo policy: USD 15 becomes INR 15, not an FX conversion.
// Existing currencies/prices are retained; existing INR prices are never overwritten.
export default async function configureIndia({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const pricing = container.resolve(Modules.PRICING)
  const regions = await container.resolve(Modules.REGION).listRegions({})
  const region = regions.find((r) => r.name === "India")
  if (!region) throw new Error("Expected an existing region named India")

  const plans: { priceSetId: string; amount: number }[] = []
  for (const entity of ["product_variant", "shipping_option"]) {
    const { data } = await query.graph({ entity, fields: ["id", "prices.*"] })
    for (const item of data) {
      const base = item.prices.filter(
        (p) =>
          !p.price_list_id &&
          !p.rules_count &&
          p.min_quantity == null &&
          p.max_quantity == null
      )
      if (base.some((p) => p.currency_code === "inr")) continue
      const usd = base.find((p) => p.currency_code === "usd")
      if (!usd)
        throw new Error(
          `No base USD price for ${entity} ${item.id}; configure INR manually`
        )
      plans.push({ priceSetId: usd.price_set_id, amount: Number(usd.amount) })
    }
  }
  for (const plan of plans) {
    await pricing.addPrices({
      priceSetId: plan.priceSetId,
      prices: [{ amount: plan.amount, currency_code: "inr" }],
    })
  }
  const stores = await container
    .resolve(Modules.STORE)
    .listStores({}, { relations: ["supported_currencies"] })
  for (const store of stores) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            ...(store.supported_currencies ?? [])
              .filter((c) => c.currency_code !== "inr")
              .map((c) => ({
                currency_code: c.currency_code,
                is_default: false,
              })),
            { currency_code: "inr", is_default: true },
          ],
        },
      },
    })
  }
  await updateRegionsWorkflow(container).run({
    input: {
      selector: { id: region.id },
      update: { name: "India", currency_code: "inr", countries: ["in"] },
    },
  })
  const zones = await container
    .resolve(Modules.FULFILLMENT)
    .listServiceZones({})
  for (const zone of zones.filter(
    (z) => z.name === "Europe" || z.name === "India"
  )) {
    await updateServiceZonesWorkflow(container).run({
      input: {
        selector: { id: zone.id },
        update: {
          name: "India",
          geo_zones: [{ type: "country", country_code: "in" }],
        },
      },
    })
  }
  console.log(
    `India configured: INR default, country IN, ${plans.length} new INR product/shipping prices. Existing INR prices preserved.`
  )
}
