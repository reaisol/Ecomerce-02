import CartDrawer from "@modules/cart/components/cart-drawer"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export default function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="min-h-[60vh]">{props.children}</div>
      <Footer />
      <CartDrawer />
    </>
  )
}
