# mighty-human

A place to share your career journey — post experiences and resources, indicate when you're open to chat, and browse resources by industry.

## Stack

- Next.js (App Router) + TypeScript + Tailwind
- Prisma + SQLite for local dev (schema is Postgres-portable; see below)
- Auth.js (NextAuth v5) with email/password credentials

## Getting started

```bash
npm install
npm run dev
```

The app runs on SQLite out of the box (`dev.db`, gitignored) so there's nothing to provision locally. Copy `.env.example` to `.env` and fill in `AUTH_SECRET` if you don't already have a `.env`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Moving to Postgres

Swap `DATABASE_URL` in `.env` to a Postgres connection string, change the `datasource` provider in `prisma/schema.prisma` from `sqlite` to `postgresql`, swap `@prisma/adapter-better-sqlite3` for `@prisma/adapter-pg` in `src/lib/prisma.ts`, and re-run `npx prisma migrate dev`.

## Features

- **Accounts** — sign up / log in with email + password, edit your profile (headline, current role, industry, bio).
- **Posts** — share an experience or a resource (article, video, podcast, tool, etc.) tagged to an industry, with an optional "open to chat" flag so others know they can reach out.
- **Industries** — filter resources by industry to see what the community has shared, plus articles and videos pulled in automatically from Google Custom Search and YouTube.

### External resources

Picking an industry triggers a background fetch (cached for 24h per industry, tracked in `IndustryFetchCache`) that pulls articles via Google's Custom Search JSON API and videos via the YouTube Data API, storing results in `ExternalResource`. Without API keys configured, this section is simply empty — nothing breaks.

To enable it, add to `.env`:

```
GOOGLE_API_KEY=""   # Google Cloud API key with Custom Search API + YouTube Data API v3 enabled
GOOGLE_CSE_ID=""    # Programmable Search Engine ID (cx) - create one at programmablesearchengine.google.com, set it to "search the entire web"
YOUTUBE_API_KEY=""  # optional, defaults to GOOGLE_API_KEY if unset
```
