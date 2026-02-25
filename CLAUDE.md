# AiTrackr — AI Reference (CLAUDE.md)

## Project Overview

AiTrackr.io is a privacy-first AI subscription tracker SaaS.
Users install a Chrome extension that tracks TIME SPENT on AI tools (never content).
Dashboard shows costs, usage, overlap detection, and savings recommendations.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL 15 + Prisma ORM |
| Auth | NextAuth v5 (Auth.js) — Google OAuth + Credentials |
| Payments | Stripe (test keys in .env.example) |
| Email | Resend + React Email |
| Extension | Chrome Extension Manifest V3 |
| Deployment | Docker Compose + Nginx on Hetzner VPS |
| Versioning | standard-version (semantic) |
| Git Hooks | husky + commitlint |

## Key Commands

```bash
# Dev
npm run dev              # Start Next.js dev server
docker compose -f docker-compose.dev.yml up -d  # Start local Postgres

# Database
npm run db:migrate       # Run migrations (dev)
npm run db:generate      # Regenerate Prisma client
npm run db:seed          # Seed with demo data (demo@aitrackr.io / Test1234!)
npm run db:studio        # Open Prisma Studio

# Testing
npm test                 # Run Vitest
npm run test:coverage    # With coverage

# Versioning
npm run release          # Auto-bump version + CHANGELOG + git tag
npm run release:patch    # Force patch bump

# Build
npm run build            # Next.js production build
docker compose up --build  # Full production stack
```

## Project Structure

```
src/
├── auth.ts              # NextAuth v5 config
├── lib/
│   ├── prisma.ts        # DB client singleton
│   ├── stripe.ts        # Stripe helpers
│   ├── email.ts         # Resend helpers
│   ├── rate-limit.ts    # Token bucket limiter
│   ├── overlap-detector.ts  # Overlap analysis algorithm
│   ├── cors.ts          # Chrome extension CORS
│   ├── api-error.ts     # Standardized error responses
│   ├── utils.ts         # cn(), formatCurrency(), etc.
│   └── validations.ts   # Zod schemas
├── emails/              # React Email templates
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── providers.tsx    # SessionProvider + ThemeProvider
│   ├── sidebar.tsx      # Dashboard nav
│   ├── top-bar.tsx      # Header with user dropdown
│   ├── overlap-banner.tsx  # Dismissible alert
│   └── delete-account-modal.tsx
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   ├── auth/            # Sign in / sign up
│   ├── dashboard/       # All dashboard pages
│   ├── pricing/
│   ├── privacy/
│   ├── terms/
│   ├── cookies/
│   └── api/             # All API routes
└── __tests__/           # Vitest tests
extension/               # Chrome Extension (Manifest V3)
```

## Critical Conventions

### Money
- ALWAYS use `Decimal(10,2)` in Prisma, NEVER float
- ALWAYS use `formatCurrency()` from utils for display

### API Responses
- SUCCESS: `NextResponse.json({ data }, { status: 200/201 })`
- ERROR: Use `errors.*` from `src/lib/api-error.ts`
  - `errors.unauthorized()` → 401
  - `errors.rateLimited()` → 429
  - `errors.notFound('Resource')` → 404
  - `errors.validation('message')` → 400
  - `errors.internal()` → 500

### Auth
- Session routes: `const session = await auth()` then check `session?.user`
- API key routes (extension): check `X-API-Key` header → lookup user.apiKey
- Cron routes: check `Authorization: Bearer ${CRON_SECRET}`

### GDPR
- User soft delete: set `deletedAt`, NOT `prisma.user.delete()`
- Hard delete runs 30 days later via GitHub Actions cron → `/api/cron/cleanup`
- Always check `user.deletedAt` in signIn callback

### Git Commits
Use conventional commits: `feat(scope): description`
Scopes: scaffold, db, auth, extension, api, ui, dashboard, pages, business, devops, docs

## Environment Variables

See `.env.example` for all required variables.
Copy to `.env` for local dev (already done with placeholder values).

## Database Models

- **User**: Auth, Stripe, GDPR, API key
- **Subscription**: Manual AI subscription entries (FREE: max 3, PRO: unlimited)
- **UsageLog**: Metadata from Chrome extension (tool, duration, sessionId)
- **OverlapAlert**: Detected savings opportunities
- **AuditLog**: GDPR audit trail (DELETE_ACCOUNT, EXPORT_DATA, etc.)
- **Account/Session/VerificationToken**: NextAuth adapter tables

## Chrome Extension

Located in `extension/`. Privacy guarantees:
- `content.js`: Reads ONLY URL hostname, model badge class names, button aria-labels
- NEVER reads: textarea content, input values, API responses, DOM text
- `background.js`: Queues `{tool, model, feature, durationSeconds, sessionId, timestamp}`
- Syncs to `/api/usage` every 5 min via `chrome.alarms`
- 401 → stop sync, show `!` badge
- 429 → exponential backoff

## Overlap Detection Algorithm (src/lib/overlap-detector.ts)

1. **DUPLICATE_CAPABILITY**: 2+ subs share a feature string → flag cheaper one to cancel
2. **UNUSED_SUBSCRIPTION**: 0 usage logs for tool in last 14 days → suggest cancel
3. **WRONG_TIER**: >$15/month but <2 hours usage in 14 days → suggest downgrade

## Pre-Launch Checklist

### Legal pages — fill in before going live
Search for `[ ` in `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` to find all placeholders:

| Placeholder | File(s) | What to fill in |
|---|---|---|
| `[ REGISTERED COMPANY NAME & ADDRESS ]` | privacy, terms | Your legal entity name + street address |
| `[ VAT NUMBER ]` | terms | EU VAT number, or remove line if not applicable |
| `[ INSERT COUNTRY ]` | terms §14 | Country whose law governs the contract (e.g., Slovenia) |
| DPA reference | privacy §8 | Already pre-filled with IP RS (Slovenia) — verify or replace |

### Other blockers before launch
- [ ] Replace `NEXTAUTH_SECRET` in `.env` with `openssl rand -base64 32`
- [ ] Replace `CRON_SECRET` in `.env` with `openssl rand -base64 32`
- [ ] Set up Stripe live keys + webhook + real price IDs
- [ ] Register `aitrackr.io` domain + point DNS to Hetzner VPS IP
- [ ] Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to `https://aitrackr.io`
- [ ] Run `certbot --nginx -d aitrackr.io -d www.aitrackr.io` for SSL
- [ ] Add `aitrackr.io` to Google OAuth authorized origins + redirect URIs
- [ ] Verify `aitrackr.io` domain in Resend + set real `RESEND_API_KEY`
- [ ] Submit Chrome extension to Chrome Web Store + update `NEXT_PUBLIC_EXTENSION_ID`

---

## Deployment

```
Hetzner VPS
├── nginx (80/443) → SSL termination
├── app (3000) → Next.js standalone
└── db (5432) → Postgres 15

Push to main → GitHub Actions → SSH → scripts/deploy.sh
```

GitHub Actions secrets needed:
- `HETZNER_HOST`, `HETZNER_USER`, `HETZNER_SSH_KEY`
- `CRON_SECRET`, `APP_URL`

## GitHub Setup

SSH public key (add to github.com/settings/keys):
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKEIK67MZS0unH4K7AZqore8QQLWtFzOGwdblr3hG0iN saso.kranjec@gmail.com
```

Create remote:
```bash
export PATH="$HOME/.local/bin:$PATH"
gh auth login
gh repo create Synapticxyz/aitrackr.io --private --source=. --remote=origin --push
```
