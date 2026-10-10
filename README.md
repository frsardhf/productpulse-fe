# Relicase frontend

Relicase is a portfolio e-commerce storefront built with Next.js 14, React, TypeScript, Tailwind CSS, and shadcn/ui. The production build is a static export hosted on Cloudflare Pages and backed by the separate [Relicase API](https://github.com/frsardhf/relicase-api).

- Live site: [relicase.pages.dev](https://relicase.pages.dev)
- API documentation: [api.relicase.eriduops.com/api](https://api.relicase.eriduops.com/api)

The catalogue uses a bounded snapshot of public-domain East Asian artwork from The Metropolitan Museum of Art Open Access collection. Artwork images are provided under CC0. Print prices, inventory, carts, checkout, and orders are portfolio simulations, and no payment is collected.

## Getting Started

Requirements:

- Node.js 20
- npm
- A running Relicase API, locally or remotely

Install dependencies and create the local environment file:

```bash
npm ci
cp .env.example .env.local
```

Set the API origin in `.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

This is public browser configuration embedded into the static JavaScript bundle at build time. Do not put database credentials, JWT secrets, or other private values in a `NEXT_PUBLIC_*` variable.

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

### Available flows

- Browse, search, filter, sort, and paginate the catalogue without signing in
- View permitted Open Access artwork images and source attribution
- Use a fixed-sequence homepage slideshow with reduced-motion support
- View source-aware product details and simulated stock states
- Sign up, sign in, update a profile, and recover cleanly from expired sessions
- Add, update, and remove cart items
- Submit a simulated checkout and view order history
- Manage products, order statuses, and user roles through protected admin views
- Use the responsive interface by keyboard across mobile and desktop layouts

### Verification

Run the same frontend checks used by CI:

```bash
npm run check
```

This runs linting, TypeScript checking, the production build, and static-export verification. To inspect the generated `out/` directory locally:

```bash
npm run preview:static
```

## Learn More

Important project files:

- `src/lib/axios.ts` validates the build-time API URL and handles expired authenticated sessions.
- `src/lib/catalogue.ts` normalizes source metadata for catalogue filtering and search.
- `src/contexts/auth-context.tsx` and `src/hooks/use-cart.ts` coordinate client-side session and cart state.
- `scripts/verify-static-export.mjs` checks required routes and Pages assets after a build.
- `public/_headers` defines security headers for Cloudflare Pages.

The backend repository contains the REST contract, Prisma schema, catalogue fixture, migrations, and transactional checkout implementation.

## Deploy on Cloudflare Pages

The repository is configured for Next.js static export with trailing-slash routes. Use these Pages settings:

| Setting | Value |
| --- | --- |
| Framework preset | Next.js (Static HTML Export) |
| Build command | `npx next build` |
| Build output directory | `out` |
| Environment variable | `NEXT_PUBLIC_API_BASE_URL=https://api.relicase.eriduops.com` |

Production deploys from `refresh/cloudflare-pages` while the refresh work is reviewed. Pull requests and refresh branches are also verified by GitHub Actions.

Because this is a static export, adding a new fixed route requires a new build and deployment. Runtime-only Next.js features such as Server Actions and request-time server rendering are intentionally not used.
