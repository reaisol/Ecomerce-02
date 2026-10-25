"use client"

import { LockClosedSolid } from "@medusajs/icons"
import { useParams, useRouter } from "next/navigation"
import { useState, type ChangeEvent, type FormEvent } from "react"

import { useCart } from "@lib/cart/cart-store"
import { INDIAN_STATES } from "@lib/orders/indian-states"
import { orderService } from "@lib/orders/order-service"
import { withPaymentFee } from "@lib/orders/payment-methods"
import type { PaymentMethod } from "@lib/orders/types"
import { formatPrice } from "@lib/util/format-price"
import EmptyCart from "@modules/cart/components/empty-cart"
import CheckoutSection from "@modules/checkout/components/checkout-section"
import CheckoutSummary from "@modules/checkout/components/checkout-summary"
import FormField from "@modules/checkout/components/form-field"
import PaymentMethodPicker from "@modules/checkout/components/payment-method-picker"
import {
  CHECKOUT_FIELDS,
  INITIAL_CHECKOUT_VALUES,
  sanitizeField,
  toPlaceOrderInput,
  validateCheckout,
  validateField,
  type CheckoutErrors,
  type CheckoutField,
  type CheckoutFormValues,
} from "@modules/checkout/lib/checkout-form"
import { Button } from "@modules/common/components/ui"
import SkeletonCheckout from "@modules/skeletons/templates/skeleton-checkout"

const fieldId = (field: CheckoutField) => `checkout-${field}`

const CheckoutForm = () => {
  const { lines, totals, isReady, clear } = useCart()
  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()

  const [values, setValues] = useState<CheckoutFormValues>(INITIAL_CHECKOUT_VALUES)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPlaced, setIsPlaced] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const orderTotals = withPaymentFee(totals, values.paymentMethod)

  if (!isReady) return <SkeletonCheckout />

  // Clearing the cart after placing the order empties `lines` before the redirect lands.
  if (isPlaced) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-r-transparent" />
        <p className="text-sm text-grey-60">Opening your order confirmation…</p>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="content-container py-12 small:py-20">
        <EmptyCart description="Add a few items to your cart before checking out." />
      </div>
    )
  }

  const setFieldError = (field: CheckoutField, value: string) =>
    setErrors((current) => ({ ...current, [field]: validateField(field, value) }))

  const fieldProps = (field: CheckoutField) => ({
    id: fieldId(field),
    name: field,
    value: values[field],
    error: errors[field],
    onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = sanitizeField(field, event.target.value)
      setValues((current) => ({ ...current, [field]: value }))
      // Only re-validate while an error is showing, so it clears as the shopper fixes it.
      if (errors[field]) setFieldError(field, value)
    },
    onBlur: () => {
      if (values[field]) setFieldError(field, values[field])
    },
  })

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    const nextErrors = validateCheckout(values)
    setErrors(nextErrors)
    const firstInvalid = CHECKOUT_FIELDS.find((field) => nextErrors[field])
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }

    setIsSubmitting(true)
    try {
      const order = await orderService.placeOrder({
        ...toPlaceOrderInput(values),
        lines,
      })
      setIsPlaced(true)
      clear()
      router.replace(`/${countryCode}/order/${order.id}/confirmed`)
    } catch {
      setSubmitError("We could not place your order. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="content-container py-6 small:py-10">
      <h1 className="font-display text-2xl font-bold text-navy-900 small:text-3xl">
        Checkout
      </h1>

      <div className="mt-6 grid grid-cols-1 items-start gap-6 small:grid-cols-[minmax(0,1fr)_400px] small:gap-8">
        <div className="small:sticky small:top-6 small:col-start-2 small:row-start-1">
          <CheckoutSummary lines={lines} totals={orderTotals} />
        </div>

        <form
          className="flex flex-col gap-6 small:col-start-1 small:row-start-1"
          onSubmit={handleSubmit}
          noValidate
          data-testid="checkout-form"
        >
          <CheckoutSection
            step={1}
            title="Contact details"
            description="We will send order updates to this email and number."
          >
            <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2">
              <FormField
                {...fieldProps("fullName")}
                label="Full name"
                autoComplete="name"
                className="xsmall:col-span-2"
              />
              <FormField
                {...fieldProps("phone")}
                label="Mobile number"
                type="tel"
                prefix="+91"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile number"
              />
              <FormField
                {...fieldProps("email")}
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
          </CheckoutSection>

          <CheckoutSection step={2} title="Delivery address">
            <div className="grid grid-cols-1 gap-4 xsmall:grid-cols-2">
              <FormField
                {...fieldProps("line1")}
                label="Flat / house no., building, street"
                autoComplete="address-line1"
                className="xsmall:col-span-2"
              />
              <FormField
                {...fieldProps("line2")}
                label="Area / locality"
                optional
                autoComplete="address-line2"
              />
              <FormField
                {...fieldProps("landmark")}
                label="Landmark"
                optional
                placeholder="E.g. near City Mall"
              />
              <FormField
                {...fieldProps("city")}
                label="City / town"
                autoComplete="address-level2"
              />
              <FormField
                {...fieldProps("state")}
                label="State"
                options={INDIAN_STATES}
                placeholder="Select state"
                autoComplete="address-level1"
              />
              <FormField
                {...fieldProps("pincode")}
                label="Pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="6-digit pincode"
              />
            </div>
          </CheckoutSection>

          <CheckoutSection step={3} title="Payment method">
            <PaymentMethodPicker
              value={values.paymentMethod}
              onChange={(paymentMethod: PaymentMethod) =>
                setValues((current) => ({ ...current, paymentMethod }))
              }
            />
          </CheckoutSection>

          <div className="flex flex-col gap-3">
            {submitError && (
              <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-600" role="alert">
                {submitError}
              </p>
            )}
            <Button
              type="submit"
              size="large"
              isLoading={isSubmitting}
              className="w-full"
              data-testid="place-order-button"
            >
              Place order · {formatPrice(orderTotals.total)}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-grey-50">
              <LockClosedSolid aria-hidden />
              Your details are only used to process this order.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
