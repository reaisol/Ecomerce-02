import type { CartLine } from "./types"

/** Renders variant options as "Color: Blue · Size: Large"; empty for single-variant products. */
export const formatLineOptions = (options: CartLine["options"]) =>
  Object.entries(options)
    .map(([name, value]) => `${name}: ${value}`)
    .join(" · ")
