# Trushop.co.in Multi-Level Marketing Module

**Document type:** Product requirements document (PRD)  
**Owner:** Product  
**Status:** Draft for business-rule approval  
**Scope:** Backend module and APIs; admin dashboard integration contract  
**Last updated:** 2026-10-27

## 1. Product summary

Trushop.co.in will provide a controlled, auditable referral-network program for customers. Each eligible member can place up to two direct members: one on the left and one on the right. A member may receive a configurable commission when a qualifying retail order is made by a direct member or a second-level member.

The first release deliberately supports **two commission levels only**. It does not include binary-pair matching, rank bonuses, unlimited-depth overrides, automatic bank payouts, or any compensation for recruiting alone.

The program must be funded by genuine product sales, not by the act of joining. A signup, referral, placement, or paid membership fee must never by itself create a commission. This makes every payout traceable to a product order and enables reversal on cancellation, refund, or return.

## 2. Goals

- Let a customer join one valid position in a left/right member network.
- Attribute qualifying order-line value to the purchaser's parent and grandparent.
- Calculate, hold, approve, reverse, and report commissions reliably.
- Allow authorized operators to manage program rules without code deployment.
- Keep product pricing, inventory, customers, carts, orders, taxes, and fulfillment in Medusa.
- Provide complete auditability for every placement, calculation, adjustment, and payout decision.

## 3. Non-goals for the first release

- Recruiting commissions without an eligible retail order.
- Binary matching volume, carry-forward volume, rank qualification, or leg balancing.
- More than two ancestor commission levels.
- Multi-currency commissions.
- Automated bank/UPI disbursement or tax withholding.
- Member-driven movement of an already placed member.
- A public, unrestricted view of another member's full personal downline.
- Changes to storefront catalog, cart, checkout, payment, or account UI beyond the APIs they will later consume.

## 4. Product principles

1. **Retail first.** Commission eligibility comes from configured products and qualifying order lifecycle events.
2. **One member, one position.** A customer can own only one active network membership.
3. **Placement is durable.** Parent and left/right side are immutable after activation; exceptional correction is an audited admin operation.
4. **Rules are versioned.** A plan change affects future qualifying orders only; historic ledger entries retain the rule version used.
5. **Money is ledgered, not recomputed.** Once calculated, a commission is stored as a ledger entry. Reports read the ledger rather than recalculate history.
6. **The client is not trusted.** Rates, order value, referral eligibility, and payout status are calculated only by the backend.
7. **Safe retries are mandatory.** Repeated events, retries, and concurrent enrollment requests must never create duplicate placement or commission records.

## 5. Core terminology

| Term | Meaning |
| --- | --- |
| Member | A Medusa customer enrolled in the network. |
| Parent | The member immediately above another member in the network. |
| Placement side | The parent's `left` or `right` direct position. |
| Level 1 | The direct parent of the customer who made a qualifying purchase. |
| Level 2 | The parent's parent (grandparent) of that purchasing customer. |
| Referral code | A unique code that identifies the intended parent. |
| Qualifying order line | An order line meeting the active plan's eligibility and lifecycle requirements. |
| Commission base | The amount used to calculate commission, normally discounted merchandise value excluding tax and shipping. |
| Commission plan | A versioned set of eligibility, rate, hold, cap, and payout rules. |
| Ledger entry | An immutable record of a calculated, adjusted, reversed, approved, or paid commission. |
| Hold period | The period after the qualifying event during which the commission cannot be paid because a cancellation or return may occur. |

## 6. Network and commission example

```text
              A
         ┌────┴────┐
       B (L)      C (R)
      ┌─┴─┐      ┌─┴─┐
     D   E      F   G
```

For an eligible order by D:

| Beneficiary | Relationship to D | Commission level | Result |
| --- | --- | --- | --- |
| B | Parent | 1 | Receives the active level-1 commission. |
| A | Grandparent | 2 | Receives the active level-2 commission. |
| C, E, F, G | Other branch members | None | Receive no commission from D's order. |

The same rule applies for E, F, and G. If B or C purchases, A is the only eligible beneficiary, at level 1. If A purchases, no upstream commission is created.

## 7. User roles

| Role | Permissions |
| --- | --- |
| Visitor | May see a referral invitation and create an account. Cannot inspect a network or commissions. |
| Customer/member | Can enroll, view their own referral code, direct-side availability, permitted downline summary, commission ledger, and payout status. |
| Customer support | Can search members and view placement/ledger history, but cannot alter plans, placements, or payouts. |
| Program administrator | Can create and activate plans, inspect trees, approve/reverse commissions, and create payout batches. |
| Finance administrator | Can view approved balances and payout batches, mark external payouts completed, and record reference numbers. |
| System | Processes qualifying orders, return/refund events, expiry of hold periods, and scheduled reconciliation. |

## 8. Functional requirements

### 8.1 Member enrollment and placement

1. A customer must be authenticated before enrollment.
2. Enrollment requires a valid active referral code and an explicit requested side: `left` or `right`.
3. The backend resolves the referral code to the placement parent. The browser must not send a raw parent ID as the authoritative relationship.
4. The selected side must be empty at the point the transaction commits.
5. The customer must not already have an active membership.
6. A customer cannot be placed under themselves, below their own descendants, or beneath an inactive/blocked parent.
7. The system generates one unique referral code per member after enrollment.
8. The membership begins in `pending` status and becomes `active` only when the configured activation condition is met. The MVP default activation condition is a first qualifying paid order.
9. An inactive member can receive no commission unless the active plan explicitly allows it.
10. The API returns a conflict, not a silent reassignment, when the requested side has already been occupied.

### 8.2 Commission-plan configuration

The active plan must be administered through protected backend APIs that the Inventory Management Dashboard consumes.

Configuration fields:

| Field | Requirement |
| --- | --- |
| Plan name and version | Required; version is immutable after activation. |
| Status | `draft`, `active`, `retired`. Only one plan is active at a time for the same market/currency. |
| Effective time | Required. A plan is selected by the qualifying event time, not by payout time. |
| Eligible products/categories | Required allow-list or explicit `all products` flag. |
| Commission base | Default: merchandise subtotal after line discounts, excluding tax, shipping, tips, and payment fees. |
| Level-1 rate | Required percentage or fixed amount; must be non-negative. |
| Level-2 rate | Required percentage or fixed amount; must be non-negative. |
| Per-line and per-order cap | Optional, but any configured cap must be applied before ledger creation. |
| Member period cap | Optional daily, weekly, or monthly cap. |
| Hold period | Required number of days or an explicit delivery/return milestone. |
| Minimum payout amount | Required threshold before an approved balance may enter a payout batch. |
| Refund/reversal policy | Required: full, proportional, or manual review. MVP default is proportional per refunded line. |

Plan updates must create a new version. Direct editing of an active or historic plan is not allowed.

### 8.3 Order qualification and calculation

1. The system evaluates each order line independently, allowing a mixed cart of eligible and non-eligible products.
2. The system selects the active plan based on the qualifying event timestamp.
3. The system resolves the purchaser's active member record, then parent and grandparent at the time of purchase.
4. The system creates at most one level-1 and one level-2 pending commission entry per qualifying order line.
5. The commission amount is rounded according to the plan's explicit rounding rule. MVP default: round half up to INR paise, then store as an integer minor-unit amount.
6. A source order line, beneficiary, commission level, and plan version combination must be unique.
7. Commission processing must be idempotent. A repeated order event returns the prior result without creating a second entry.
8. The original purchaser cannot be their own beneficiary, even if corrupted or legacy network data exists.
9. The calculation stores a complete snapshot: source order, source line, buyer, beneficiary, relationship depth, plan version, base amount, rate, computed amount, currency, and timestamp.

### 8.4 Commission lifecycle

```text
not created
  → pending
  → approved
  → included_in_payout
  → paid

pending / approved / included_in_payout
  → reversed
```

| State | Meaning |
| --- | --- |
| `pending` | Calculated but still inside the hold/return window. |
| `approved` | Eligible for payout after the hold condition is satisfied. |
| `included_in_payout` | Locked into a payout batch; not eligible for another batch. |
| `paid` | Finance recorded the external payout completion and reference. |
| `reversed` | Removed because of cancellation, refund, return, fraud, rule breach, or an audited correction. |

An order cancellation or refund before payout reverses the related entry. A refund after payout creates a negative adjustment or receivable according to the approved finance policy; it must never silently alter an already paid entry.

### 8.5 Payout operations

1. Payouts are manual/export-only in the MVP.
2. The system groups approved commissions by beneficiary and currency.
3. A member must meet the minimum payout amount before inclusion.
4. One ledger entry can belong to only one payout batch.
5. Finance marks a batch as `exported`, `processing`, `paid`, or `failed` and records an external reference.
6. A failed payout returns entries to `approved` only if no money left the business; otherwise it requires a compensating adjustment.
7. Payout recipient banking/UPI details are out of scope until security, KYC, and privacy requirements are approved.

## 9. API contract

All endpoints return standard error envelopes with a machine-readable code, human-readable message, correlation ID, and safe field-level validation details. No API returns another member's address, email, phone, order details, or payout details to a customer.

### 9.1 Customer APIs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/store/network/enroll` | Enroll the authenticated customer using `referral_code` and `side`. |
| `GET` | `/store/network/me` | Return current membership, referral code, parent summary, direct side occupancy, and aggregate balances. |
| `GET` | `/store/network/me/tree?depth=1..2` | Return the authenticated member's permitted downline projection. |
| `GET` | `/store/network/me/commissions` | Paginated ledger entries and balance totals for the authenticated member. |
| `GET` | `/store/network/me/payouts` | Payout history for the authenticated member. |
| `GET` | `/store/network/referrals/:code` | Public-safe referral preview: brand, inviter display name, and available sides only. |

### 9.2 Admin APIs

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET`, `POST` | `/admin/chain-marketing/plans` | List plans or create a draft version. |
| `GET`, `POST` | `/admin/chain-marketing/plans/:id/activate` | Inspect or activate a validated draft plan. |
| `POST` | `/admin/chain-marketing/plans/:id/retire` | Retire a plan from future calculations. |
| `GET` | `/admin/chain-marketing/members` | Search/filter members and their status. |
| `GET` | `/admin/chain-marketing/members/:id/tree` | Inspect an administrative tree view. |
| `POST` | `/admin/chain-marketing/members/:id/status` | Suspend, reactivate, or block a member with audit reason. |
| `POST` | `/admin/chain-marketing/members/:id/correction` | Request an audited placement correction; restricted to exceptional cases. |
| `GET` | `/admin/chain-marketing/commissions` | Filter/export the ledger. |
| `POST` | `/admin/chain-marketing/commissions/:id/reverse` | Create a reasoned reversal/adjustment. |
| `GET`, `POST` | `/admin/chain-marketing/payout-batches` | View or create payout batches. |
| `POST` | `/admin/chain-marketing/payout-batches/:id/status` | Record export, processing, paid, or failed status. |
| `POST` | `/admin/chain-marketing/reconciliation/run` | Run a protected, dry-run-first reconciliation job. |

### 9.3 Existing Medusa APIs

No replacement APIs are required for catalog or inventory management. The Inventory Management Dashboard uses Medusa's existing Admin APIs for products, variants, prices, categories, inventory items, stock locations, orders, customers, refunds, and fulfillment.

## 10. Backend architecture

```text
Store / Admin API route
        ↓
Validation + authentication + authorization
        ↓
Chain-marketing workflow
        ↓
Chain-marketing module service + Medusa core services
        ↓
PostgreSQL ledger and membership data

Medusa order/refund event
        ↓
Subscriber
        ↓
Idempotent commission workflow
        ↓
Commission ledger
```

The module is responsible for chain-specific data and rules. Medusa remains responsible for customer authentication, products, prices, cart totals, orders, payment state, inventory, fulfillment, and refunds.

## 11. Data model requirements

### 11.1 Network member

Required fields:

- `id`
- `customer_id` (unique)
- `referral_code` (unique, case-insensitive)
- `parent_member_id` (nullable only for approved root members)
- `placement_side` (`left` or `right`; required when parent exists)
- `status` (`pending`, `active`, `suspended`, `blocked`, `closed`)
- `activated_at`, `suspended_at`, `closed_at`
- `created_at`, `updated_at`, `deleted_at`

Required constraints:

- one active member per customer;
- one active child per `(parent_member_id, placement_side)`;
- no self-parent reference;
- root membership requires an explicit, auditable administrator action;
- referral code uniqueness must use normalized casing.

### 11.2 Commission plan

Required fields:

- `id`, `version`, `name`, `status`, `effective_at`, `retired_at`;
- eligibility configuration;
- level-1 and level-2 rules;
- commission-base definition;
- currency and rounding policy;
- hold policy, caps, and payout threshold;
- created/updated actor and timestamps.

### 11.3 Commission ledger

Required fields:

- `id`, `status`, `currency_code`, `amount`;
- source order and source order-line identifiers;
- purchaser customer/member identifiers;
- beneficiary customer/member identifiers;
- relationship depth;
- plan ID and immutable rule snapshot;
- base amount, rate/fixed rule, rounding result;
- event ID/idempotency key;
- hold expiry and approval/reversal/payment timestamps;
- reversal/adjustment linkage and reason;
- payout batch ID, where applicable.

## 12. Edge cases and expected behavior

### 12.1 Enrollment and tree integrity

| Scenario | Required behavior |
| --- | --- |
| Referral code does not exist, is expired, or belongs to a blocked member | Reject enrollment with a safe validation error. |
| Requested left/right side is already occupied | Return `409 conflict`; do not place the member elsewhere. |
| Two customers select the same side simultaneously | Exactly one placement succeeds; the other receives `409 conflict` after transactional constraint enforcement. |
| Customer retries enrollment after timeout | Return the original membership if inputs match; do not create another record. |
| Customer is already enrolled | Return their existing membership; reject a different parent/side request. |
| Member attempts self-referral | Reject. |
| Referral creates a cycle due to corrupted/manual data | Reject and raise an operations alert. |
| Parent is suspended, blocked, or closed | Reject new placement unless a future plan explicitly supports inactive-parent placement. |
| Parent has no open requested side | Reject; no automatic spillover in MVP. |
| Referral code changes after a link is shared | Existing code remains valid unless explicitly revoked; a replacement must not silently reroute historic links. |
| Account merge or duplicate customer resolution | Freeze affected membership and require audited admin reconciliation. |
| Customer deletion request | Anonymize personal data where legally required while retaining financial ledger references; do not erase accounting history. |

### 12.2 Order and commission calculation

| Scenario | Required behavior |
| --- | --- |
| Order contains eligible and ineligible items | Calculate only eligible order lines. |
| Product eligibility changes after checkout | Use the plan and eligibility snapshot selected at the qualifying event; never reinterpret historic entries. |
| Product price changes after purchase | Use the order-line amount, never current product price. |
| Order contains discount, tax, shipping, COD fee, or tips | Exclude/include only according to the explicit commission-base rule; MVP excludes tax, shipping, tips, and payment fees. |
| Multi-quantity line | Calculate from the final line subtotal, with quantity included in the stored snapshot. |
| Buyer has no membership | Create no commission and record a diagnostic event only. |
| Buyer has a parent but no grandparent | Create level 1 only. |
| Parent/grandparent inactive | Follow active plan rule; MVP skips that beneficiary and records the skip reason. |
| Buyer, parent, and beneficiary are the same due to bad data | Skip, alert, and never self-pay. |
| Same order event delivered twice | Return the existing ledger entries; do not duplicate. |
| Order is edited after placement | Re-evaluate only documented edit events; otherwise hold until final fulfillment. |
| Order currency differs from plan currency | Reject qualification or convert only through an approved FX policy. MVP supports INR only. |
| Rate calculation yields fractional paise | Apply documented rounding once per ledger entry, not repeatedly in totals. |
| Cap is reached | Create a zero or capped entry with a clear reason; do not silently overpay. |
| No active plan | Create no commission and alert administrators; never fall back to an arbitrary historic plan. |

### 12.3 Cancellation, refunds, returns, and fraud

| Scenario | Required behavior |
| --- | --- |
| Order is cancelled before qualifying | Create no commission. |
| Full refund while pending | Reverse all related pending entries. |
| Partial line refund | Proportionally reverse only the affected line amount. |
| Return occurs after approval but before payout | Reverse/remove the approved amount before batching. |
| Return occurs after payout | Create a negative adjustment and flag the member balance for finance review. |
| Chargeback or payment failure | Reverse related entries and block payout until the dispute is resolved. |
| Fraudulent/self-dealing order | Freeze related ledger entries; only a privileged admin may resolve with an audit reason. |
| Manual refund adjustment | The system must link the adjustment to the original ledger entry and order event. |

### 12.4 Payout and finance operations

| Scenario | Required behavior |
| --- | --- |
| Balance below payout threshold | Keep entries approved but do not batch them. |
| Payout batch creation runs twice | Use locking/idempotency; an entry can appear in one batch only. |
| Payout provider/export fails before money leaves | Mark batch failed and safely return entries to approved. |
| Payout succeeds but callback is delayed/retried | Match by immutable payout reference; never pay twice. |
| Member is blocked after approval | Pause unpaid entries; paid entries remain historic. |
| Negative balance after post-payout return | Carry forward debt/negative adjustment; finance policy decides recovery. |
| Admin manually adjusts a balance | Require reason, actor, timestamp, approval policy, and an immutable adjustment entry. |

### 12.5 Security, privacy, and operations

| Scenario | Required behavior |
| --- | --- |
| Customer requests another member's data | Return only privacy-safe display data allowed by the API contract. |
| Non-admin calls an admin endpoint | Return `401/403`; never rely on client-side hiding. |
| Operator changes a plan | Record before/after values, actor, request ID, and activation time. |
| Database/network retry occurs | Use transactional writes and idempotency keys. |
| Queue/subscriber is down | Persist/retry commission processing and show reconciliation status. |
| Clock/timezone boundary | Store timestamps in UTC; calculate payout periods using an explicit business timezone. |
| Neon connection failure | Fail safely, do not acknowledge enrollment or payout before commit, and surface operational alerts. |
| Data migration bug | Use additive migrations, backup/restore plan, dry-run reconciliation, and no destructive resets. |

## 13. Acceptance criteria

The MVP is complete only when all of the following are true:

1. An authenticated customer can be placed on an available left or right side using a referral code.
2. The system enforces one membership per customer and one child per parent-side pair under concurrent requests.
3. The A–G example creates correct level-1 and level-2 pending ledger entries for an eligible retail order.
4. Ineligible products, non-members, and orders without an active plan produce no commission.
5. Duplicate event delivery produces no duplicate ledger item.
6. A qualifying order cancellation, return, and partial refund produce the documented reversal behavior.
7. An operator can create a new plan version and activate it without altering historic entries.
8. The inventory dashboard can configure eligibility and view the member tree, ledger, and payout batches through protected APIs.
9. Every placement, plan change, adjustment, reversal, and payout status transition is audit logged.
10. Automated unit, integration, concurrency, and event-retry tests pass against PostgreSQL.

## 14. Delivery phases

### Phase 0 — Business-rule sign-off

- Approve legal/compliance position and customer terms.
- Approve activation event, qualifying event, commission base, rates, hold period, payout threshold, and refund policy.
- Confirm India/INR-only scope and business timezone.
- Confirm who may be a root member and who may approve changes.

### Phase 1 — Foundation

- Configure the backend database and initialize the Medusa schema.
- Rename the Medusa store to Trushop.co.in.
- Add the chain-marketing module, additive migration, core data models, authorization middleware, and audit logging.
- Deliver enrollment and member-query APIs with tests.

### Phase 2 — Commission engine

- Build plan-version APIs and validation.
- Build order qualification and idempotent level-1/level-2 calculation workflow.
- Add order/refund subscribers, hold expiry job, reversals, and reconciliation report.
- Deliver ledger and admin reporting APIs with integration tests.

### Phase 3 — Finance operations

- Build payout-batch creation, approval, export, paid/failed status recording, and finance audit reports.
- Perform controlled dry run with non-production orders.

### Phase 4 — Storefront integration

- Add referral invitation, enrollment, tree summary, commission history, and payout history screens.
- Convert the cart and checkout to Medusa before enabling live commissions.
- Launch behind a feature flag with a small controlled cohort.

### Phase 5 — Future enhancements

- Binary matching-volume rules and carry-forward volume.
- Rank/achievement rules.
- Payment-provider payout automation and KYC workflow.
- Tax statements, withholding, and finance reconciliation integration.
- Analytics dashboard, fraud scoring, and anomaly alerts.

## 15. Decisions required before development starts

| Decision | Recommended MVP default |
| --- | --- |
| What triggers qualification? | Fulfilled/delivered eligible order after the return window. |
| Is member activation required? | First qualifying paid order activates the member. |
| Commission type? | Percentage of discounted eligible merchandise subtotal. |
| Levels? | Two: direct parent and grandparent. |
| Rates? | Business to provide level-1 and level-2 rates. |
| Hold period? | Business to provide; recommend at least the product return window. |
| Refund handling? | Proportional reversal by refunded order line. |
| Payout method? | Manual approval/export first; no automatic UPI/bank transfer in MVP. |
| Placement policy? | Customer selects an open left/right side; no spillover in MVP. |
| Root-member policy? | Admin-created, audited root only. |

## 16. Compliance and launch gate

Before enabling the program for customers, legal and finance stakeholders must approve the member terms, commission plan, cancellation/refund treatment, payout policy, applicable tax handling, privacy disclosures, and jurisdictional compliance. The product must not launch if the compensation plan relies on recruitment rather than qualifying retail sales.

