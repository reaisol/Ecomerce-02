import type { ExecArgs } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

const STORE_NAME = "Trushop.co.in"

export default async function setStoreName({ container }: ExecArgs) {
  const storeModuleService = container.resolve(Modules.STORE)
  const stores = await storeModuleService.listStores()

  if (!stores.length) {
    throw new Error("No Medusa store exists to rename")
  }

  for (const store of stores) {
    await storeModuleService.updateStores(store.id, { name: STORE_NAME })
  }
}
