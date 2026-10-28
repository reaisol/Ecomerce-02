import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"
import logo from "../assets/trushop-logo.png"
import "./login-branding.css"

const LoginBranding = () => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = "trushop | Admin login"
    return () => { document.title = previousTitle }
  }, [])

  return (
    <header className="trushop-login-brand">
      <img src={logo} alt="trushop" width={230} height={123} />
      <h1>Welcome to trushop</h1>
      <p>Sign in to manage your store.</p>
    </header>
  )
}

export const config = defineWidgetConfig({ zone: "login.before" })
export default LoginBranding
