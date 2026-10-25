import { ChevronDown } from "@medusajs/icons"
import type { ChangeEvent, FocusEvent, HTMLAttributes } from "react"

import { clx } from "@modules/common/components/ui"

type FormFieldProps = {
  id: string
  name: string
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onBlur?: (event: FocusEvent<HTMLInputElement | HTMLSelectElement>) => void
  error?: string
  optional?: boolean
  /** Renders a select with these options instead of a text input. */
  options?: readonly string[]
  placeholder?: string
  /** Fixed text shown inside the input before the value, e.g. "+91". */
  prefix?: string
  type?: "text" | "email" | "tel"
  autoComplete?: string
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"]
  maxLength?: number
  className?: string
}

const controlClass =
  "h-12 w-full rounded-xl border bg-white px-3.5 text-base text-navy-900 transition-colors placeholder:text-grey-40 focus:outline-none focus:ring-2 small:text-sm"

/** Labelled text input or select with an inline error, wired up for screen readers. */
const FormField = ({
  id,
  label,
  error,
  optional,
  options,
  placeholder,
  prefix,
  type = "text",
  className,
  ...controlProps
}: FormFieldProps) => {
  const errorId = `${id}-error`
  const sharedProps = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    "aria-required": optional ? undefined : true,
  }
  const stateClass = error
    ? "border-danger-600 focus:ring-danger-600/20"
    : "border-grey-20 hover:border-grey-30 focus:border-brand-500 focus:ring-brand-500/20"

  return (
    <div className={clx("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-navy-800">
        {label}
        {optional && (
          <span className="ml-1 font-normal text-grey-50">(optional)</span>
        )}
      </label>

      {options ? (
        <div className="relative">
          <select
            {...controlProps}
            {...sharedProps}
            className={clx(
              controlClass,
              stateClass,
              "appearance-none pr-10",
              !controlProps.value && "text-grey-40"
            )}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option} value={option} className="text-navy-900">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-50"
            aria-hidden
          />
        </div>
      ) : (
        <div className="relative">
          {prefix && (
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-r border-grey-20 pl-3.5 pr-3 text-base text-grey-60 small:text-sm"
              aria-hidden
            >
              {prefix}
            </span>
          )}
          <input
            {...controlProps}
            {...sharedProps}
            type={type}
            placeholder={placeholder}
            className={clx(controlClass, stateClass, prefix && "pl-[4.25rem]")}
          />
        </div>
      )}

      {error && (
        <p id={errorId} className="text-sm text-danger-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField
