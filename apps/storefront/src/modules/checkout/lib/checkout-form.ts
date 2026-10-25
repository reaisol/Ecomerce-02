import { INDIAN_STATES } from "@lib/orders/indian-states"
import type { PaymentMethod, PlaceOrderInput } from "@lib/orders/types"

export type CheckoutFormValues = {
  fullName: string
  phone: string
  email: string
  line1: string
  line2: string
  landmark: string
  city: string
  state: string
  pincode: string
  paymentMethod: PaymentMethod
}

export type CheckoutField = Exclude<keyof CheckoutFormValues, "paymentMethod">

export type CheckoutErrors = Partial<Record<CheckoutField, string>>

/** Display order of the fields; the first invalid one in this order receives focus on submit. */
export const CHECKOUT_FIELDS: CheckoutField[] = [
  "fullName",
  "phone",
  "email",
  "line1",
  "line2",
  "landmark",
  "city",
  "state",
  "pincode",
]

export const INITIAL_CHECKOUT_VALUES: CheckoutFormValues = {
  fullName: "",
  phone: "",
  email: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  paymentMethod: "upi",
}

const PHONE_PATTERN = /^[6-9]\d{9}$/
const PINCODE_PATTERN = /^[1-9]\d{5}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validators: Record<CheckoutField, (value: string) => string | undefined> = {
  fullName: (v) =>
    v.trim().length < 2 ? "Enter your full name" : undefined,
  phone: (v) =>
    !v
      ? "Enter your mobile number"
      : PHONE_PATTERN.test(v)
        ? undefined
        : "Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9",
  email: (v) =>
    !v.trim()
      ? "Enter your email address"
      : EMAIL_PATTERN.test(v.trim())
        ? undefined
        : "Enter a valid email address",
  line1: (v) =>
    v.trim().length < 5 ? "Enter your flat / house number and street" : undefined,
  line2: () => undefined,
  landmark: () => undefined,
  city: (v) => (v.trim().length < 2 ? "Enter your city" : undefined),
  state: (v) =>
    (INDIAN_STATES as readonly string[]).includes(v)
      ? undefined
      : "Select your state",
  pincode: (v) =>
    !v
      ? "Enter your pincode"
      : PINCODE_PATTERN.test(v)
        ? undefined
        : "Enter a valid 6-digit pincode",
}

export const validateField = (field: CheckoutField, value: string) =>
  validators[field](value)

export function validateCheckout(values: CheckoutFormValues): CheckoutErrors {
  const errors: CheckoutErrors = {}
  for (const field of CHECKOUT_FIELDS) {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
  }
  return errors
}

/** Strips characters a shopper may type that are not part of the stored value. */
export const sanitizeField = (field: CheckoutField, value: string) => {
  if (field === "phone") {
    const digits = value.replace(/\D/g, "")
    // Pasted numbers often carry the +91 country code or a trunk 0.
    const local = digits.length > 10 ? digits.replace(/^(91|0)/, "") : digits
    return local.slice(0, 10)
  }
  if (field === "pincode") return value.replace(/\D/g, "").slice(0, 6)
  return value
}

const optional = (value: string) => value.trim() || undefined

export const toPlaceOrderInput = (
  values: CheckoutFormValues
): Omit<PlaceOrderInput, "lines"> => ({
  customer: {
    fullName: values.fullName.trim(),
    phone: values.phone,
    email: values.email.trim(),
  },
  shippingAddress: {
    line1: values.line1.trim(),
    line2: optional(values.line2),
    landmark: optional(values.landmark),
    city: values.city.trim(),
    state: values.state,
    pincode: values.pincode,
  },
  paymentMethod: values.paymentMethod,
})
