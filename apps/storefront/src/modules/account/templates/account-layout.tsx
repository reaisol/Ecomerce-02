import React from "react"

import { brand } from "@lib/brand"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto my-8 rounded-2xl bg-white shadow-card flex flex-col">
        <div className="grid grid-cols-1  small:grid-cols-[240px_1fr] py-12">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-gray-200 py-12 gap-8">
          <div>
            <h3 className="text-xl-semi mb-4">Got questions?</h3>
            <span className="txt-medium">
              Our support team is available {brand.contact.hours}.
            </span>
          </div>
          <a
            href={`mailto:${brand.contact.email}`}
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            {brand.contact.email}
          </a>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
