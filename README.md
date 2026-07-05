# Eshkol Bet Hakerem Opportunities

A full-stack React and Express platform for discovering and managing youth opportunities in Hebrew and Arabic.

## Final Project Deliverables

The complete final project submission is available in the [`final project files`](./final%20project%20files/) directory.

This directory contains:

- The final project documentation in Word format (`.docx`)
- The final project documentation in PDF format (`.pdf`)
- The project's marketing and demonstration video (`.mp4`)

## Quick Start

Requirements:

- Node.js `^20.19.0` or `>=22.12.0` (required by the current Vite version)
- A local or hosted MongoDB database

```bash
npm install
npm run dev
```

Before starting, copy `.env.example` to a local `.env` file and configure it as described below. `npm run dev` starts Vite and automatically starts the Express API. The frontend is served by Vite, and `/api` requests are proxied to `http://localhost:3001`.

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `MONGODB_DB` | Database name; defaults to `eshkol` |
| `AUTH_SECRET` | Secret used to sign authentication tokens; use a long random value outside local development |
| `PORT` | Optional API port; defaults to `3001` |

Never commit `.env` or real credentials.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the frontend and API in development mode |
| `npm run dev:server` | Start only the API with file watching |
| `npm run build` | Create the production frontend build in `dist/` |
| `npm run lint` | Run ESLint across the project |
| `npm run check` | Run lint and a production build |
| `npm run preview` | Preview the production frontend build |

## Project Map

```text
.
├── final project files/         final submission documents and marketing video
├── api/                         Vercel serverless entry point
├── public/                      assets served without bundling
├── server/                      Express API
│   └── src/
│       ├── routes/              HTTP paths and access guards
│       ├── controllers/         HTTP request/response adapters
│       ├── services/            validation, authorization, and workflows
│       ├── repositories/        MongoDB access
│       ├── models/              collection names and entity shaping
│       ├── middleware/          database, authentication, and error middleware
│       ├── app.js               reusable Express application
│       └── index.js             local API process entry point
├── src/                         React frontend
│   ├── app/                     application composition and global state
│   │   ├── App.jsx              frontend composition root
│   │   ├── store/               API-backed application store
│   │   └── hooks/               session, preferences, and toast state
│   ├── features/                code grouped by user-facing domain
│   ├── shared/components/       reusable UI shared by multiple features
│   ├── services/                frontend HTTP client
│   ├── data/                    static reference data only
│   ├── i18n/                    Hebrew and Arabic translations
│   └── utils/                   reusable non-UI helpers
├── Architecture_Guide.md        detailed architecture and request flows
├── FUNCTION_TREE.md             frontend/backend function inventory
├── MONGODB_DATABASE_GUIDE.md    MongoDB schemas, relationships and operations
├── vite.config.js               frontend tooling and local API startup
└── vercel.json                  production API rewrite
```



### Frontend organization

Feature-specific code stays inside `src/features/<feature>`. A feature may contain `pages`, `components`, `hooks`, and `utils` when needed. Code moves to `src/shared` only when multiple features use it. Static lookup data belongs in `src/data`; live server data belongs in `src/app/store`.

The admin area follows the same rule:

```text
src/features/admin/
├── opportunities/              staff/admin opportunity management
├── statistics/                 analytical dashboard
└── users/                      admin-only account management
```

### Backend request flow

```text
HTTP request
  -> middleware
  -> route
  -> controller
  -> service
  -> repository
  -> MongoDB
```

- Routes declare the endpoint and its access requirements.
- Controllers translate HTTP data and should remain small.
- Services own validation, authorization, ownership, and multi-step workflows.
- Repositories are the only normal runtime layer that queries MongoDB.

## Authentication

Login returns a safe user and an eight-hour signed bearer token. The browser stores the session in tab-scoped `sessionStorage`, and the API verifies the token and reloads the current user before protected requests. Server routes enforce roles, self-access, and staff organization ownership.

Current limitation: passwords are still stored as directly compared values. Before production use, migrate existing passwords to salted one-way hashes such as Argon2id or bcrypt.

## Why There Are Two `package.json` Files

The root manifest owns the full application, frontend tooling, and dependencies required by the Vercel deployment. `server/package.json` allows the Express API to be installed or run independently. For normal local development from the repository root, use the root commands above.

For a deeper explanation of individual files, API access rules, data flows, and deployment, see [Architecture_Guide.md](./Architecture_Guide.md). For the complete frontend/backend function inventory and call trees, see [FUNCTION_TREE.md](./FUNCTION_TREE.md). For collection schemas, relationships, indexes, and MongoDB operations, see [MONGODB_DATABASE_GUIDE.md](./MONGODB_DATABASE_GUIDE.md).
