# The SEBI test: Varyaa Creations

Would Footnote have helped on an IPO that SEBI later acted on? The first of three such
filings, run 29 October 2026. The full write-up is at
**[footnote-story.vercel.app](https://footnote-story.vercel.app)**.

> SEBI's findings quoted here come from its own orders. Most are interim and *prima facie*,
> "tentative in nature, pending detailed investigation". **The Varyaa interim order was
> revoked on 29 Dec 2025.** Nothing here says any person or company is guilty of anything.

## The filing

**Varyaa Creations Limited**, prospectus dated 12 Apr 2024, BSE SME, ₹20.10 Cr issue, 294
pages, downloaded from BSE. Lead manager: Inventure Merchant Banker Services (INM000012003).

## Run

| | |
|---|---|
| Model | `deepseek-v4.1-flash` via an OpenAI-compatible endpoint |
| Time | **84 s** |
| Facts | **81**, all **81 quotes found word for word** on their pages |
| People | 5, all linked by DIN |
| Promoter holding | 93.33% |

## What it flagged

| Flag | Severity | Finding |
|---|---|---|
| Pending cases | For context | 7 cases, ₹11.7 lakh at stake where stated (p.172–173) |
| IPO money to related parties | Reassuring | The filing states no proceeds will be paid to promoters, directors or group companies (p.67) |

Nothing reached "worth reading". That is the result, and it is correct for the document.

## Why it found nothing, and what the filing did contain

According to SEBI's interim order (14 May 2025), ₹14 Cr left the IPO account on listing day
to three entities that appear nowhere in the prospectus. **No prospectus reader can see money
that moves after the prospectus is printed.**

What the prospectus did contain, and Footnote extracted with a page:

- **The yardstick.** Issue expenses estimated at **₹60 lakh, 2.99% of the issue** (p.67).
  The amount SEBI says left the account as "IPO-related expenses" is about 23 times that.
  Synoptics Technologies, a separate SEBI case, shows the same ratio (₹80 lakh disclosed,
  ₹19 Cr moved).
- **Size against size.** Net worth was negative two years before a ₹20 Cr raise; the latest
  period reported ₹3.51 Cr profit with **−₹3.71 Cr operating cash flow**.
- **The people.** Lead manager, registrar, auditor, promoters, directors and five
  promoter-group entities, mapped and linked.

No rule fired on the size or cash-flow numbers. That is a gap in the rules, reported as one
rather than patched after the fact to "catch" this case.

## Changes this run is driving

1. Extract the disclosed issue-expense figure as its own field, so post-listing disclosures
   can be compared against it.
2. A lead-manager page: every IPO a banker handled, with any SEBI orders against it.
3. Run Synoptics Technologies and Nirman Agri Genetics (both NSE Emerge, downloaded by hand)
   with and without `data/sebi_orders.json`.

## Sources

- SEBI interim order, Varyaa Creations Ltd, 14 May 2025 —
  [sebi.gov.in](https://www.sebi.gov.in/enforcement/orders/may-2025/interim-order-in-the-matter-of-varyaa-creations-limited_93924.html).
  Revoked 29 Dec 2025.
- SEBI confirmatory order, Synoptics Technologies Ltd, 3 Oct 2025 —
  [PDF](https://www.sebi.gov.in/sebi_data/attachdocs/oct-2025/confirmatory_order_synoptics.pdf)
- Varyaa Creations prospectus, 12 Apr 2024 —
  [BSE](https://www.bseindia.com/corporates/download/345104/SME_IPO%20Open/Varyaa%20Creation%20Limited_20240417155644.pdf)
