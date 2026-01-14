# V Save a Life Foundation — YouCaring‑style MVP (Next.js + Prisma + Stripe Connect)

This repository is a Vercel‑ready MVP inspired by the clean YouCaring presentation:
- Home page: **Featured campaigns only**
- Explore page: **Category filter (single‑select) + title‑only search**
  - Currency tabs: **All / USD / EUR / GBP**
  - When **All**, shows **3 sections** (USD/EUR/GBP) each sorted by **Most raised**
- Campaign page:
  - Progress bar + donate card
  - Right side donor panel:
    - **Top donors (10)**
    - **Latest donors (10)**
- Payments:
  - Stripe Connect **direct charges** on connected accounts
  - Platform fee: **max(1.00, 5% of donation)** (no cap), deducted from creator proceeds
  - Minimum donation: **5.00** (USD/EUR/GBP)

> Notes
> - Creator Stripe onboarding/consent UI is included as a simple demo page at `/dashboard`.
> - Media uploads + watermarking are scaffolded as TODOs for the next iteration.

---

## 1) Tech Stack
- Next.js (App Router) + TypeScript
- TailwindCSS
- Prisma + Postgres
- Stripe (Checkout + Connect OAuth)

---

## 2) Setup (Local)

### Prereqs
- Node.js 18+
- Postgres database (Neon/Supabase/Vercel Postgres)
- Stripe account with Connect enabled

### Install
```bash
npm install
```

### Configure env
Copy `.env.example` to `.env.local` and fill values.

```bash
cp .env.example .env.local
```

### DB migrate + seed
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### Run
```bash
npm run dev
```
Open http://localhost:3000

---

## 3) Stripe setup

### Required env vars
- `STRIPE_SECRET_KEY`
- `STRIPE_CLIENT_ID` (Connect OAuth)
- `STRIPE_WEBHOOK_SECRET`

### Webhook (local)
Install Stripe CLI and forward events:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## 4) Deploy to Vercel
1. Push this repo to GitHub
2. Import into Vercel
3. Add the same environment variables in Vercel Project Settings
4. Set Stripe webhook endpoint to:
   `https://<your-domain>/api/stripe/webhook`

---

## 5) Demo pages
- `/` Home (Featured only)
- `/explore` Explore with filters
- `/c/[slug]` Campaign page
- `/dashboard` Demo creator dashboard (connect Stripe + consent)

---

## 6) Next steps (planned)
- Creator campaign builder (cover, story editor with images + YouTube embeds)
- Updates (progress posts)
- Large file uploads via signed URLs
- Watermarked public derivatives and **no-download** public viewers
