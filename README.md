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

| Script         | Description                                                     |
|----------------|-----------------------------------------------------------------|
| `pnpm dev`     | Start the Vite dev server (alias: `pnpm start`).                |
| `pnpm build`   | Build for production into `build/`.                             |
| `pnpm preview` | Serve the production build locally.                             |
| `pnpm analyze` | Open a source-map treemap of the built bundles.                 |
| `pnpm cy:open` | Open the Cypress runner.                                        |
| `pnpm cy:run`  | Run the Cypress suite headlessly (`cy:run:headed` to watch it). |

## Configuration

Environment variables live in `.env` and `.env.development`. Vite is configured to
accept both `VITE_` and `REACT_APP_` prefixes, and the app currently reads:

- `REACT_APP_API_URL` — base URL of the Rails API, e.g. `http://localhost:3001/api/v1`.
- `REACT_APP_URL` — public URL of this app.

## Layout

```
src/
  components/   shared UI, including shadcn/ui primitives in components/ui
  pages/        route-level screens (Admin, Auth, Customers, Sales, Washes, …)
  services/     API clients built on services/request.ts
  lib/, utils/  helpers and formatting
cypress/e2e/    end-to-end specs
```

## Tests

End-to-end tests are Cypress specs in `cypress/e2e`. Start the dev server first,
then `pnpm cy:open` or `pnpm cy:run`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
app, syncs `build/` to the S3 bucket and invalidates the CloudFront distribution.
The workflow can also be run manually via `workflow_dispatch`.
