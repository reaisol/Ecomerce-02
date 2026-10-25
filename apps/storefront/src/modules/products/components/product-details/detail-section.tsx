import type { ReactNode } from "react"

const DetailSection = ({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) => (
  <section
    aria-labelledby={`${id}-heading`}
    className="rounded-2xl bg-white p-5 shadow-card small:p-7"
  >
    <h2
      id={`${id}-heading`}
      className="mb-4 font-display text-lg font-bold text-navy-900 small:text-xl"
    >
      {title}
    </h2>
    {children}
  </section>
)

export default DetailSection
