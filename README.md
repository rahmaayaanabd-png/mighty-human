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
- **Industries** — filter resources by industry to find what others have shared for that field.

Resources are user-submitted for now. The `Post.source` field (`USER_SUBMITTED` / `EXTERNAL`) is there so a future ingestion job (RSS, YouTube, etc.) can add external resources without a schema change.
