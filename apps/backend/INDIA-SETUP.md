# India demo configuration

After initial database setup, run from `apps/backend`:

```sh
npx medusa exec ./src/scripts/configure-india.ts
```

This sets INR as the default store currency, changes the existing India region
to INR and country IN, and replaces the demo Europe delivery zone with India.
It adds INR base prices to product variants and shipping options using the same
numbers as their USD demo prices, as approved by the owner. It does not perform
an exchange-rate conversion. Existing INR prices and historical foreign-currency
prices are preserved. Re-running does not overwrite manually edited INR prices.

The storefront uses en-IN formatting, Indian address fields, INR and /in routes.
Checkout remains the existing local demo; payment processing and GST rates have
not been configured by this script. Review actual product and delivery prices
in admin before using this store for real orders.
