"use client"

type OptionRowProps = {
  id: string
  type: "radio" | "checkbox"
  name?: string
  label: string
  count?: number
  checked: boolean
  onChange: () => void
}

const OptionRow = ({
  id,
  type,
  name,
  label,
  count,
  checked,
  onChange,
}: OptionRowProps) => (
  <label
    htmlFor={id}
    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-grey-70 hover:bg-surface-muted"
  >
    <input
      id={id}
      type={type}
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
    />
    <span className={checked ? "font-semibold text-navy-900" : undefined}>
      {label}
    </span>
    {count !== undefined && (
      <span className="ml-auto text-xs tabular-nums text-grey-40">{count}</span>
    )}
  </label>
)

export default OptionRow
