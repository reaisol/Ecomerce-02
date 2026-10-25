import { Metadata } from "next"

import OrderConfirmation from "@modules/order/templates/order-confirmation"

type Props = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your order has been placed successfully.",
  robots: { index: false },
}

export default async function OrderConfirmedPage(props: Props) {
  const { id } = await props.params

  return <OrderConfirmation orderId={id} />
}
