# Carbon Car Wash — frontend

React single-page app for the Carbon Car Wash loyalty programme: capturing washes,
managing customers and vehicles, and running sales and reports for staff.

Built with React 19, TypeScript, Vite, Tailwind CSS v4 and shadcn/ui components.
It talks to the Rails API in `car-wash-app/`.

## Getting started

Requires Node 22 and pnpm (see `packageManager` in `package.json`).

```sh
pnpm install
pnpm dev
```

The dev server runs on [http://localhost:3000](http://localhost:3000).

## Scripts

| Script             | Description                                          |
|--------------------|------------------------------------------------------|
| `pnpm dev`         | Start the Vite dev server (alias: `pnpm start`).     |
| `pnpm build`       | Build for production into `build/`.                  |
| `pnpm preview`     | Serve the production build locally.                  |
| `pnpm typecheck`   | Type-check the project with `tsc --noEmit`.          |
| `pnpm lint`        | Lint with oxlint (`lint:fix` applies fixes).         |
| `pnpm knip`        | Report unused files, exports and dependencies.       |
| `pnpm test:e2e`    | Run the Playwright end-to-end suite headlessly.      |
| `pnpm test:e2e:ui` | Open the Playwright UI runner.                       |

## Configuration

Environment variables live in `.env` and `.env.development`. Vite is configured to
accept both `VITE_` and `REACT_APP_` prefixes, and the app currently reads:

- `REACT_APP_API_URL` — base URL of the Rails API, e.g. `http://localhost:3001/api/v1`.
- `REACT_APP_URL` — public URL of this app.
- `VITE_DEV_AUTH_ROLE` — dev only, skips the route guards by assuming the named
  roles (e.g. `manager` or `manager,salesperson`). Compiled out of builds.

## Layout

```
src/
  components/   shared UI, including shadcn/ui primitives in components/ui
  pages/        route-level screens (Admin, Auth, Customers, Sales, Washes, …)
  services/     API clients built on services/request.ts
  lib/, utils/  helpers and formatting
tests/e2e/      Playwright specs, fixtures and screenshot baselines
```

## Tests

End-to-end tests are Playwright specs in `tests/e2e`. Playwright starts its own
dev server on port 3002, so no server needs to be running first:

```sh
pnpm test:e2e
```

Every spec stubs the API calls it needs — an unstubbed call is meant to fail
loudly rather than reach a live backend. `tests/e2e/a11y.spec.ts` runs axe against
the main screens, and `screenshots.spec.ts` holds visual baselines; regenerate
those with `pnpm test:e2e --update-snapshots` when a change to them is intended.

Baselines are stored per platform under `tests/e2e/__screenshots__/<platform>/`,
because font rendering differs between them. Only macOS baselines are committed,
so the visual spec skips itself elsewhere (CI included). To cover another
platform, generate its baselines there and remove the `test.skip` at the top of
`screenshots.spec.ts`.

## CI and deployment

`.github/workflows/ci.yml` lints, type-checks, builds, runs knip and runs the
end-to-end suite on every pull request and on pushes to `master` and `main`.

Lint rules live in `.oxlintrc.json` and knip's config in `knip.json`.

`.github/workflows/deploy.yml` builds the app, syncs `build/` to the S3 bucket and
invalidates the CloudFront distribution. It runs on pushes to `main` and can also
be triggered manually via `workflow_dispatch`.
