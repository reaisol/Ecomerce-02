import { useId, type ReactNode } from "react"

const FilterSection = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => {
  const headingId = useId()

  return (
    <div role="group" aria-labelledby={headingId} className="py-4 first:pt-0 last:pb-0">
      <h3 id={headingId} className="mb-2.5 text-sm font-semibold text-navy-900">
        {title}
      </h3>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}

export default FilterSection
