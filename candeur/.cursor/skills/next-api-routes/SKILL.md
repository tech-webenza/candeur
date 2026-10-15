---
name: next-api-routes
description: Creates and maintains Next.js App Router Route Handlers (app/api) with correct HTTP methods, validation, errors, and types. Use when the user asks for API routes, REST endpoints, webhooks, or server-side JSON handlers in Next.js.
---

# Next.js API routes (Route Handlers)

This project uses the **App Router**. Handlers live at `app/api/**/route.ts`, not `pages/api`.

Read `node_modules/next/dist/docs` for version-specific APIs when behavior is unclear (this repo uses Next 16).

## Workflow

1. Confirm requirement: method(s), auth, request/response shape, error cases.
2. Search for existing handlers or server actions; reuse patterns and utilities.
3. Add `app/api/<segment>/route.ts` (or nested segments).
4. Implement handlers; validate input; return typed `Response` / `NextResponse`.
5. Call from client with `fetch('/api/...')` or from Server Components with absolute URL or direct server logic (prefer server-side fetch or shared service when no HTTP boundary is needed).

## File structure

```
app/
  api/
    contact/
      route.ts          # /api/contact
    posts/
      [id]/
        route.ts        # /api/posts/:id
```

## Handler template

```tsx
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    // ... load data (DB, CMS, file)

    return NextResponse.json({ ok: true, data: {} });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // validate body (required fields, types)

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
```

Export only the HTTP methods the route supports (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`).

## Conventions

- **Validation**: reject invalid input with `400`; use explicit checks or project Zod/schema if present.
- **Auth**: check session/API key in handler or shared middleware pattern; return `401` / `403` without leaking secrets.
- **Secrets**: read from `process.env`; never commit credentials; document new env vars in `.env.example` if the project uses it.
- **CORS**: default Next same-origin; add CORS headers only for public APIs that need cross-origin access.
- **Caching**: `export const dynamic = 'force-dynamic'` when responses must not be cached; use `revalidate` or cache headers when appropriate.
- **Rate limiting**: apply at edge/platform or in handler for sensitive routes if required.

## Server Actions vs Route Handlers

- **Route Handler**: webhooks, third-party callbacks, REST for mobile/external clients, explicit HTTP semantics.
- **Server Action**: form mutations from React when the project already uses actions; do not duplicate the same mutation in both without reason.

## Client usage

```tsx
const res = await fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
if (!res.ok) throw new Error("Request failed");
const data = await res.json();
```

## Testing

- Manual: `curl` or REST client against `http://localhost:3000/api/...` with dev server running.
- After changes: `npm run build` to catch type and export errors.

## Do not

- Change unrelated API contracts without explicit request.
- Put business logic only in the route file when the project uses a `lib/` or `services/` layer—follow existing layering.
- Block the event loop with huge synchronous work; stream or offload when needed.

## This project (landing)

| Route | Purpose |
|-------|---------|
| `GET /api/health` | Liveness check (`dynamic = force-dynamic`) |
| `GET /api/landing/news` | News cards JSON from `lib/landing/content.ts` (`revalidate: 3600`) |
| `GET /api/life-at/content` | Life @ DTH page JSON from `lib/life-at/content.ts` (`revalidate: 3600`) |
| `POST /api/contact` | Validated contact payload; optional `CONTACT_WEBHOOK_URL` forward |

Page data lives in `lib/landing/content.ts`; prefer importing there in Server Components. Use the news route for external clients or client `fetch` when needed.

## Checklist

- [ ] Correct path and exported methods
- [ ] Input validation and consistent JSON error shape
- [ ] Appropriate status codes
- [ ] Env vars for secrets
- [ ] No sensitive data in client bundles
- [ ] Build passes
