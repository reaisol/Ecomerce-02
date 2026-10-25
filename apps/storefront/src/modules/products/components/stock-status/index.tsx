import { clx } from "@modules/common/components/ui"

const LOW_STOCK_THRESHOLD = 5

const StockStatus = ({ stock, className }: { stock: number; className?: string }) => {
  const tone =
    stock <= 0 ? "danger" : stock <= LOW_STOCK_THRESHOLD ? "warning" : "success"
  const label =
    stock <= 0 ? "Out of stock" : tone === "warning" ? `Only ${stock} left` : "In stock"

  return (
    <p
      className={clx(
        "inline-flex items-center gap-2 text-sm font-semibold",
        {
          "text-success-700": tone === "success",
          "text-warning-600": tone === "warning",
          "text-danger-600": tone === "danger",
        },
        className
      )}
      data-testid="stock-status"
    >
      <span
        className={clx("h-2 w-2 rounded-full", {
          "bg-success-600": tone === "success",
          "bg-warning-600": tone === "warning",
          "bg-danger-600": tone === "danger",
        })}
        aria-hidden
      />
      {label}
    </p>
  )
}

export default StockStatus
