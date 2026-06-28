# Eshkol Bet Hakerem — Complete Architecture Guide

---

## Part 1 — Big Picture

### What This Project Does

**Eshkol Bet Hakerem** is a bilingual Hebrew-Arabic community web platform for discovering and managing youth opportunities. It brings activities from several local organizations into one place, so young people do not need to search each organization separately.

The system serves four practical audiences:

- **Visitors** can open the home page, browse and filter opportunities, view opportunity details, see the gallery, and reach the login or registration pages.
- **Youth users** (`role: "User"`) can also register for opportunities, cancel registrations, view their registered activities, and use a personal calendar.
- **Organization staff** (`role: "Staff"`) can manage opportunities that belong to their own organization and view statistics.
- **Administrators** (`role: "Admin"`) can manage every opportunity, view statistics, and create, edit, filter, or delete user accounts.

The main features are:

- Hebrew and Arabic presentation with a right-to-left layout.
- Public opportunity discovery with search and filters for category, organization, city, type, scope, and age.
- Opportunity detail and registration overlays.
- Youth self-registration, login, registration cancellation, and saved profile details.
- A personal calendar based on the logged-in user's registrations.
- Staff and administrator opportunity management.
- Administrator user management.
- Analytics for users, opportunities, registrations, cancellations, views, cities, categories, roles, and conversion rate.
- Responsive styling, dark mode, toast feedback, confirmation dialogs, and a static community gallery.

### Which Technologies Are Used

Versions below are the versions declared in the current `package.json` files.

| Layer | Technology | Version / Notes |
|---|---|---|
| Frontend UI | React and React DOM | `^19.2.6`; functional components and hooks |
| Frontend build tool | Vite | `^8.0.12` |
| React compilation | `@vitejs/plugin-react` | `^6.0.1` |
| Styling | Tailwind CSS through `@tailwindcss/vite` | `^4.3.0`, plus custom rules in `src/index.css` |
| Charts | Recharts | `^3.8.1` |
| Frontend routing | Manual screen routing | `currentScreen` state and a `switch` in `ScreenSwitcher.jsx`; no React Router |
| Frontend state | React `useState`, `useEffect`, `useMemo`, and custom hooks | No Redux, Zustand, or React Context store |
| API communication | Browser Fetch API | Central wrapper in `src/services/api.js`; JSON and a 15-second timeout |
| Localization | Custom translation dictionaries | `src/i18n/he.js`, `ar.js`, and `i18n.js` |
| Backend runtime | Node.js with ECMAScript modules | Node version is not pinned in the repository |
| Backend framework | Express | `^4.21.2` |
| Database | MongoDB | Database chosen through `MONGODB_URI` and `MONGODB_DB` |
| Database driver | Official `mongodb` Node driver | Root declares `^6.21.0`; `server/package.json` declares `^6.12.0` |
| Authentication | Custom username/password lookup | Browser session saved in `localStorage`; no JWT, cookie session, or OAuth |
| Cross-origin support | `cors` | `^2.8.5` |
| Environment loading | `dotenv` | `^16.4.7` |
| Development proxy | Vite proxy | `/api` to `http://localhost:3001` |
| Production deployment | Vercel | Static Vite build plus Express serverless entry in `api/index.js` |
| Static assets | Vite `public/` directory | Logo, SVG icons, and gallery photographs |
| Code quality | ESLint | `^10.3.0` and React hook/refresh plugins |

### Why These Technologies

**React** fits this project because screens, filters, overlays, forms, calendars, and dashboards change without full page reloads. Components keep recurring UI such as the navigation bar, cards, charts, and dialogs separate and reusable.

**Vite** provides a fast development server and production build. Its configuration also starts the local Express process and proxies `/api` requests, so one root command runs the normal development environment.

**Tailwind CSS** makes responsive and state-based styling practical inside components. `src/index.css` adds project-wide behavior that utility classes alone do not cover, including the Heebo font, animation keyframes, dark-mode overrides, gallery masonry rules, and mobile safe-area behavior.

**Custom React hooks** are sufficient for the current scale. Shared concerns are separated into `useApiStore`, `useSession`, `useAppPreferences`, `useToast`, and feature hooks. A larger external store would add another abstraction without being required by the present data flow.

**Express** gives the backend a small HTTP layer while allowing the project to use an explicit route-controller-service-repository structure. It also works as both a normal Node server and the Express application exported to Vercel.

**MongoDB** matches the document-shaped entities used by the application. The repository layer can store opportunity, registration, view, profile, and user documents directly, while aggregation pipelines support the statistics dashboard.

**Recharts** turns the statistics response into responsive bar and pie charts without the project implementing chart rendering itself.

**Custom i18n dictionaries** are simple for two known interface languages. Translation keys are resolved through `useT(lang)`, and the same helper supports variable replacement in translated messages.

### How Frontend and Backend Communicate

The frontend and backend communicate through **HTTP requests to REST-style endpoints under `/api`**. Request bodies and successful responses are JSON. `express.json()` parses incoming JSON, and controllers answer with `res.json(...)`.

`src/services/api.js` is the only general HTTP client. It:

1. Builds the request URL.
2. Adds `Content-Type: application/json`.
3. serializes mutation bodies with `JSON.stringify`.
4. aborts a request after 15 seconds.
5. converts non-success responses into errors containing `status` and, when available, a parsed response `body`.

In development, the browser requests `/api/...` from Vite. `vite.config.js` proxies those requests to `http://localhost:3001`, where Express is listening. `VITE_API_URL` may supply a development base URL; production deliberately uses the same origin.

In production, Vite builds the frontend as static files. `vercel.json` rewrites `/api/*` traffic to the serverless entry `api/index.js`, which exports the Express app from `server/src/app.js`.

The backend does **not** render HTML. `index.html` and the Vite bundle create the browser UI; Express only provides JSON API responses.

### Architectural Approach

The project is a **full-stack client-server application** with:

- A **React Single Page Application (SPA)** in the browser.
- A **layered Express REST API** on the server.
- A **MongoDB database** behind repository modules.
- A single repository and deployment unit, so it is a modular full-stack monolith rather than a microservice system.

Frontend routing is state-based. `useAppPreferences` owns `currentScreen`, and `ScreenSwitcher.jsx` maps that value to one page or feature component. Browser URLs do not represent individual screens, and there is no route history library.

Frontend data flows downward as props, while callbacks flow upward. Server-backed application data lives in `useApiStore`. Smaller concerns use focused hooks: session, preferences, toast messages, filters, opportunity workflow, users, and statistics.

Backend requests flow in one direction:

```text
Express route -> controller -> service -> repository -> MongoDB
```

Models build or sanitize entity objects, middleware handles cross-cutting request behavior, and `AppError` carries controlled HTTP error information to the global error handler.

### Why This Architecture Makes Sense

The system has several screens and business domains but is still small enough to deploy as one application. A feature-based React structure keeps related pages, hooks, and components together. The backend layers make database code, HTTP details, and business rules independently understandable without introducing separate services or deployments.

The architecture is especially suitable for an academic project because every responsibility has a visible home:

- UI composition belongs to pages and components.
- Browser workflows belong to hooks.
- HTTP details belong to the API client.
- HTTP endpoint definitions belong to routes and controllers.
- rules and multi-step operations belong to services.
- MongoDB queries belong to repositories.

One important current boundary is security: login verifies credentials, but the returned user is stored in browser `localStorage`, passwords are compared as stored values, and backend management routes have no authentication or authorization middleware. Frontend role checks improve the interface but do not protect the API. This is acceptable only as a current project limitation, not as production-grade access control.

---

## Part 2 — Project Execution Flow

### Step 1: Developer runs `npm run dev`

**File:** `package.json`

**Why:** This is the root development command.

**What happens:** The `dev` script runs `vite`. Vite reads `vite.config.js`, activates the React and Tailwind plugins, starts its browser development server, and installs the `/api` proxy.

### Step 2: The development backend is spawned

**File:** `vite.config.js`

**Why:** The custom `auto-express` plugin lets the normal frontend command start both application processes.

**What happens:** `configureServer()` resolves `server/src/index.js` and starts it with the same Node executable that is running Vite. Output is inherited by the terminal. When the Vite HTTP server closes, the plugin attempts to stop the child process.

An alternative backend-only command is `npm run dev:server`, which delegates to `server/package.json` and runs `node --watch src/index.js`.

### Step 3: The Express application is configured

**Files:** `server/src/index.js`, `server/src/app.js`

**Why:** `server/src/app.js` constructs a reusable Express application, while `server/src/index.js` performs process-specific startup and port listening. This separation is what allows Vercel to import the same app without calling `listen()`.

**Configuration order:**

1. `cors()` is registered.
2. `express.json()` is registered.
3. `/api/health` is mounted before database middleware, so health checks do not require MongoDB.
4. `connectDbMiddleware` is registered for later routes.
5. Organization, auth, bootstrap, opportunity, event, view, registration, profile, user, and statistics routers are mounted at `/api`.
6. The four-argument global error handler is registered last.

`server/src/index.js` selects `process.env.PORT` or port `3001`, starts listening, and handles `EADDRINUSE` by allowing an already-running local server to remain responsible.

### Step 4: Database connection begins

**File:** `server/src/db.js`

**Why:** Every repository needs one shared, reusable MongoDB connection.

**What happens:**

- Environment values are loaded from the repository's root `.env`. The code also attempts an optional `server/.env` path, but that second file was not present during this repository inspection.
- `MONGODB_URI` defaults to `mongodb://127.0.0.1:27017`.
- `MONGODB_DB` defaults to `eshkol`.
- `connectDb()` caches the in-progress promise so concurrent calls do not create several clients.
- A failed connection clears the cached promise, allowing a later request to retry.
- `connectDbMiddleware` awaits this connection before every database-backed route.

The startup call in `server/src/index.js` is eager but non-blocking. The middleware is the final guarantee before a database route executes.

### Step 5: Browser loads the frontend

**Files:** `index.html`, `src/main.jsx`, `src/index.css`

**What happens:** Vite serves `index.html`. Its module script loads `src/main.jsx`, which imports global CSS and `App.jsx`. React's `createRoot` mounts `<App />` into `<div id="root">` inside `StrictMode`.

### Step 6: Root component initializes

**File:** `src/App.jsx`

**Global state and hooks:**

- `useDataStore()` selects the API-backed application store.
- `useAppPreferences()` restores the saved screen and theme, owns language, and updates document language/title.
- `useSession()` restores the current user from `localStorage`.
- `useToast()` manages temporary success/error messages.
- `useOpportunityWorkflow()` manages opportunity selection, view recording, registration, and cancellation.

Until startup data finishes, `AppStatus.jsx` renders a loading screen. If bootstrap fails, it renders a reload-based error screen.

### Step 7: Bootstrap data loads

**Frontend file:** `src/app/data/useApiStore.js`

**API endpoint:** `GET /api/bootstrap`

**Backend path:**

```text
routes/bootstrap.js
  -> controllers/bootstrapController.js
  -> services/bootstrapService.js
  -> repositories/bootstrapRepository.js
  -> MongoDB
```

The repository loads opportunities, events, registrations, cancellations, views, and profiles in parallel. The service converts profile documents into an object keyed by `userId`. The frontend saves every returned collection in React state and marks the store ready.

### Step 8: UI renders

`App.jsx` always renders the outer RTL container, `Navbar`, `Toast`, and `<main>`. `ScreenSwitcher` chooses one screen from `currentScreen`. `AppOverlays` independently places the opportunity detail and registration dialogs above the active screen.

The visible screen can be `home`, `login`, `register`, `opportunities`, `calendar`, `gallery`, `my-registrations`, or `admin`. Role checks in `App.jsx` and `ScreenSwitcher.jsx` decide whether protected interface screens can be reached.

---

## Part 3 — Frontend Structure

### Folder Overview

```text
index.html
public/
├── eshkol-logo.png
├── icons.svg
└── gallery/                         static gallery photographs
src/
├── main.jsx                         browser entry point
├── App.jsx                          root composition and navigation guards
├── index.css                        Tailwind import and global styling
├── app/
│   ├── ScreenSwitcher.jsx           screen selection
│   ├── AppOverlays.jsx              root-level modals
│   ├── AppStatus.jsx                loading/error screens
│   ├── data/
│   │   ├── useDataStore.js          data-store facade
│   │   └── useApiStore.js           API-backed application data
│   └── hooks/
│       ├── useAppPreferences.js
│       ├── useSession.js
│       └── useToast.js
├── features/
│   ├── admin/
│   │   ├── components/              staff panel and opportunity form
│   │   ├── statistics/              dashboard, hooks, charts, calculations
│   │   └── users/                   user management, hook, form, filters, table
│   ├── auth/                        login/register pages and auth hook
│   ├── calendar/                    calendar container and presentation parts
│   ├── gallery/                     gallery page
│   ├── home/                        home page
│   ├── opportunities/               board, cards, modals, filters, workflow
│   └── registrations/               youth registration list page
├── shared/components/               reusable application-wide UI
├── services/api.js                  HTTP client
├── i18n/                            Hebrew/Arabic dictionaries and translator
├── data/                            static organizations/options/gallery metadata
└── utils/                           pure storage, permission, calendar/date helpers
```

`app/` contains application-wide orchestration. `features/` groups code by user-facing domain. `shared/` is for UI that does not belong to one domain. `services/`, `i18n/`, `data/`, and `utils/` provide lower-level capabilities used by several features.

## `src/main.jsx`

**Purpose:** Mounts React into the browser DOM.

**Why it exists:** The build tool needs one clear JavaScript entry point.

**Who calls it:** `index.html` through its module script.

**What it receives:** The DOM element with ID `root`.

**Main responsibilities:** Load global CSS, create the React root, enable `StrictMode`, and render `App`.

**How it fits:** It is the boundary between the static HTML shell and the React application.

## `src/App.jsx`

**Purpose:** Composes the global application shell.

**Why it exists:** Session, preferences, navigation guards, data readiness, notifications, routes, and overlays affect more than one feature.

**Who calls it:** `src/main.jsx`.

**What it receives:** No props; it initializes the application hooks.

**Main responsibilities:** Restore global browser state, load server data, redirect unauthorized screen navigation, handle login/logout destinations, wire the opportunity workflow, and render the shell.

**How it fits:** It is the frontend composition root. It coordinates modules but leaves detailed UI and business workflows in smaller files.

## `src/app/ScreenSwitcher.jsx`

**Purpose:** Maps `currentScreen` to the correct page or feature container.

**Why it exists:** Moving the large screen switch out of `App.jsx` keeps root composition readable.

**Who calls it:** `App.jsx`.

**What it receives:** Current screen/user/language, the store, and navigation/action callbacks.

**Main responsibilities:** Render all eight supported screens and pass each one only the data it requires. It applies a second role check around youth registrations and staff/admin screens.

**How it fits:** It performs client-side screen routing without React Router or URL routes.

## `src/app/AppOverlays.jsx`

**Purpose:** Renders opportunity-related modals at the root level.

**Why it exists:** Details and registration must overlay any current page and share one selected opportunity.

**Who calls it:** `App.jsx`.

**What it receives:** Language, user, store, and the object returned by `useOpportunityWorkflow`.

**Main responsibilities:** Determine whether the user is already registered and choose between `OpportunityDetailModal` and `RegistrationModal`.

**How it fits:** It keeps overlay state synchronized with the central opportunity workflow.

## `src/app/AppStatus.jsx`

**Purpose:** Provides the full-screen startup loading and load-error states.

**Why it exists:** Normal pages should not handle incomplete bootstrap data.

**Who calls it:** `App.jsx`.

**What it receives:** Translated labels and error text.

**Main responsibilities:** Show a spinner or a retry-by-reload error message.

**How it fits:** It guards the main UI until the store has completed its first request.

## `src/app/data/useDataStore.js`

**Purpose:** Defines the application-level data-store facade.

**Why it exists:** Callers depend on `useDataStore`, while the implementation can remain replaceable.

**Who calls it:** `App.jsx`.

**What it receives:** No parameters.

**Main responsibilities:** Currently re-export `useApiStore` as the only data source.

**How it fits:** It prevents the root component from depending on the implementation filename.

## `src/app/data/useApiStore.js`

**Purpose:** Holds server-backed frontend data and mutation methods.

**Why it exists:** Pages should not independently duplicate bootstrap, API calls, and state synchronization.

**Who calls it:** `useDataStore`/`App.jsx`.

**What it receives:** Data returned by `api.js`; mutation parameters from feature callbacks.

**Main responsibilities:** Bootstrap six datasets; expose readiness/error state; add/update/delete opportunities and events; replace an opportunity's events; deduplicate views in the current client state; register/unregister youth; update cached profiles; and provide `isRegistered`/`getProfile` selectors.

**How it fits:** It is the browser-side source of truth for the main application data after bootstrap.

## `src/app/hooks/useSession.js`

**Purpose:** Owns the current browser session.

**Why it exists:** Session persistence is distinct from MongoDB application data.

**Who calls it:** `App.jsx`.

**What it receives:** A safe user returned by login.

**Main responsibilities:** Restore, save, and clear `eshkol_session` in `localStorage`.

**How it fits:** Its `currentUser` controls navigation and role-specific presentation. It does not create a server session.

## `src/app/hooks/useAppPreferences.js`

**Purpose:** Owns screen, theme, and language preferences.

**Why it exists:** These settings affect the whole application but are unrelated to server data.

**Who calls it:** `App.jsx`.

**What it receives:** Stored screen/theme values and user toggle actions.

**Main responsibilities:** Persist screen/theme, switch Hebrew/Arabic, and update `<html lang>` and the document title.

**How it fits:** It supplies the state used by `Navbar`, the root CSS classes, and `ScreenSwitcher`.

## `src/app/hooks/useToast.js`

**Purpose:** Manages one temporary notification.

**Why it exists:** Success and error feedback is shared by several workflows.

**Who calls it:** `App.jsx`; its callback is passed into feature code.

**What it receives:** Message and optional type.

**Main responsibilities:** Replace any existing toast, clear its old timer, and hide the new toast after three seconds.

**How it fits:** `Toast.jsx` only renders state; this hook owns its lifecycle.

### Feature Pages and Components

## `src/features/home/pages/HomePage.jsx`

**Purpose:** Presents the public landing page, mission, values, team, gallery-based hero, and calls to action.

**Why it exists:** Introductory content is a complete destination and should not make `App.jsx` responsible for marketing presentation.

**Who calls it:** `ScreenSwitcher` for `home`.

**What it receives:** User, language, navigation callback, and current opportunity count.

**Main responsibilities:** Rotate hero images, show translated content/statistics, and send visitors to opportunities, login, or registration.

**How it fits:** It is mostly static but receives the real opportunity count from the bootstrap store.

## `src/features/auth/pages/LoginPage.jsx` and `RegisterPage.jsx`

**Purpose:** Collect login credentials or a new youth account.

**Why they exist:** Authentication forms have their own validation, loading, success, and error UI.

**Who calls them:** `ScreenSwitcher` for `login` and `register`.

**What they receive:** Language and navigation callbacks; login also receives `onLogin`.

**Main responsibilities:** Validate browser input, call `useAuthActions`, translate API errors, prevent duplicate submissions, and navigate after success.

**How they fit:** They are thin feature pages above the centralized API client. A successful login passes the safe user upward to `App.jsx`.

## `src/features/auth/hooks/useAuthActions.js`

**Purpose:** Exposes stable `login` and `register` feature actions.

**Why it exists:** Pages depend on authentication intentions rather than importing raw endpoint methods.

**Who calls it:** Both authentication pages.

**What it receives:** User form values.

**Main responsibilities:** Delegate to `api.login` and `api.registerUser`.

**How it fits:** It is the small browser workflow layer between auth UI and the general API service.

## `src/features/opportunities/pages/OpportunitiesBoardPage.jsx`

**Purpose:** Displays the searchable, filterable opportunity catalog.

**Why it exists:** Discovery is the central public feature and has enough UI state to be a dedicated page.

**Who calls it:** `ScreenSwitcher` for `opportunities`.

**What it receives:** Opportunity array, language, and modal-opening callback.

**Main responsibilities:** Compose category chips, search, dropdown filters, age filtering, responsive filter visibility, empty state, and the card grid.

**How it fits:** Filtering is entirely client-side against bootstrap data; opening a card delegates to the root workflow.

## `src/features/opportunities/hooks/useOpportunityFilters.js`

**Purpose:** Owns and computes all catalog filters.

**Why it exists:** Keeping filtering rules outside JSX makes the board easier to read and independently change.

**Who calls it:** `OpportunitiesBoardPage`.

**What it receives:** Opportunities and whether Arabic labels are active.

**Main responsibilities:** Store seven filter values, compute available cities/types, search translated and raw fields, calculate filtered results with `useMemo`, and clear all filters.

**How it fits:** It is a pure browser feature; it never calls the backend.

## `src/features/opportunities/hooks/useOpportunityWorkflow.js`

**Purpose:** Coordinates viewing, registering, and cancelling from any screen.

**Why it exists:** Opportunity actions can begin in the board, registrations page, or calendar and must share overlay state.

**Who calls it:** `App.jsx`.

**What it receives:** Store, current user, navigation, toast callback, and translator.

**Main responsibilities:** Select/close an opportunity, record a view, enforce UI role rules, open/close registration, call store mutations, and report outcomes.

**How it fits:** It is the main frontend workflow layer for the project's core domain.

## `src/features/opportunities/components/OpportunityCard.jsx`, `FilterDropdown.jsx`, `OpportunityDetailModal.jsx`, and `RegistrationModal.jsx`

**Purpose:** Provide the reusable catalog card, accessible custom filter choice, full opportunity details, and registration form.

**Why they exist:** Each unit has a focused interaction or visual responsibility and would make the board or root overlay code too large if inlined.

**Who calls them:** The board calls cards/dropdowns; `AppOverlays` calls both modals.

**What they receive:** Opportunity data, translated labels, filter values, existing profile, registration status, and callbacks.

**Main responsibilities:** Present localized opportunity metadata, close modals on backdrop/Escape, ask for settlement/interests only when a profile is missing, and delegate all mutations to callbacks.

**How they fit:** They contain presentation and local form state, while `useOpportunityWorkflow` and `useApiStore` own business actions and persistence.

## `src/features/registrations/pages/MyRegistrationsPage.jsx`

**Purpose:** Shows one youth user's registered opportunities.

**Why it exists:** Personal registrations are a protected, user-specific destination.

**Who calls it:** `ScreenSwitcher` when `currentScreen` is `my-registrations` and the role is `User`.

**What it receives:** User, opportunities, registrations, language, and open/cancel/navigation callbacks.

**Main responsibilities:** Join registration records to opportunities in memory, sort by registration date, render cancellation confirmation, and link back to discovery.

**How it fits:** It reads central store arrays but sends cancellation through the shared opportunity workflow.

## `src/features/calendar/components/EventsCalendar.jsx`

**Purpose:** Coordinates the personal month calendar.

**Why it exists:** Month navigation, selected date, and registered opportunity selection belong together.

**Who calls it:** `ScreenSwitcher` for `calendar`.

**What it receives:** Current user, registrations, opportunities, language, and navigation/open callbacks.

**Main responsibilities:** Find opportunity IDs registered by the user, convert generated `events[].startsAt` values into calendar entries, fall back to legacy `opportunity.eventDate` values, calculate the month grid and upcoming count, and compose the empty state, grid, and day panel.

**How it fits:** It is a feature container over `CalendarGrid`, `CalendarDayPanel`, and `CalendarEmptyState`.

## `src/features/calendar/components/CalendarGrid.jsx`, `CalendarDayPanel.jsx`, and `CalendarEmptyState.jsx`

**Purpose:** Render the month, selected-day activities, and no-session/no-events experience.

**Why they exist:** They separate calendar calculation/control from focused presentation states.

**Who calls them:** `EventsCalendar`.

**What they receive:** Prepared dates/opportunities, translated text, and callbacks.

**Main responsibilities:** Navigate months, mark days containing activities, open details, and guide users toward login or opportunity discovery.

**How they fit:** They do not call services; all required data is prepared by their parent.

## `src/features/gallery/pages/GalleryPage.jsx`

**Purpose:** Displays and filters the local community photo gallery.

**Why it exists:** The gallery is a self-contained public screen.

**Who calls it:** `ScreenSwitcher` for `gallery`.

**What it receives:** Current language.

**Main responsibilities:** Filter `GALLERY_ITEMS` by tag and render responsive local images and captions.

**How it fits:** It uses static metadata and `public/gallery`; it makes no API request.

## `src/features/admin/components/StaffPanel.jsx`

**Purpose:** Hosts opportunity management, statistics, and admin-only user management.

**Why it exists:** Staff work is a separate interface with organization and role constraints.

**Who calls it:** `ScreenSwitcher` for staff/admin users on `admin`.

**What it receives:** User, all analytical datasets, opportunity mutations, event replacement, language, and toast callback.

**Main responsibilities:** Select tabs; filter manageable opportunities; search; open add/edit forms; confirm deletion; enforce organization filtering in the UI; and compose statistics/users subfeatures.

**How it fits:** It is the administrative feature shell. Actual API mutations come from the store or nested admin hooks.

## `src/features/admin/components/OpportunityForm.jsx`

**Purpose:** Collects bilingual opportunity and schedule fields.

**Why it exists:** Opportunity validation and event generation are complex enough to isolate.

**Who calls it:** `StaffPanel`.

**What it receives:** Existing opportunity or blank mode, current staff/admin user, language, save/cancel callbacks.

**Main responsibilities:** Apply defaults, limit staff organization selection, require all four start/end date and time fields, validate date/time order, normalize Israeli date input, prefill legacy schedule fields during editing, and call `buildCalendarEvents` for a date range.

**How it fits:** `StaffPanel` first saves the opportunity and then replaces its associated event documents.

## `src/features/admin/users/UserManagement.jsx` and `hooks/useUsers.js`

**Purpose:** Coordinate admin user CRUD and its server data.

**Why they exist:** Users are not part of bootstrap data and have their own loading/error/refetch lifecycle.

**Who calls them:** `StaffPanel` calls `UserManagement`; that component calls `useUsers`.

**What they receive:** Current administrator, language, filters/forms, and toast callback.

**Main responsibilities:** Fetch `/api/users`, apply local filters, open add/edit/delete dialogs, run CRUD calls, and reload the list after each mutation.

**How they fit:** `UserFilters`, `UsersTable`, and `UserFormModal` are presentation parts beneath this feature container. The current user cannot select their own delete button in the table.

## `src/features/admin/statistics/StatsDashboard.jsx` and `hooks/useStatistics.js`

**Purpose:** Load, normalize, and display analytics.

**Why they exist:** Statistics have a separate endpoint and several visualization-specific transformations.

**Who calls them:** `StaffPanel` calls `StatsDashboard`; it calls `useStatistics`.

**What they receive:** Bootstrap arrays for fallback calculations, language, and toast callback.

**Main responsibilities:** Fetch `/api/stats`, fall back to `computeLocalStats` if remote data is unavailable, localize month/city/category/title labels, and distribute data to chart components.

**How they fit:** `KpiGrid`, `MonthlyCharts`, `DistributionCharts`, `TopOpportunitiesChart`, `StatisticsSummary`, and `StatsUi` are focused Recharts/presentation components. `constants.js` provides the shared color palette.

### Shared Services, Data, and Utilities

## `src/services/api.js`

**Purpose:** Defines all browser-to-backend requests.

**Why it exists:** URL building, JSON headers, timeout, logging, and error conversion should behave consistently.

**Who calls it:** API store, authentication, users, and statistics hooks.

**What it receives:** Endpoint-specific arguments and request bodies.

**Main responsibilities:** Expose health, bootstrap, auth, opportunity, event, view, registration, profile, user, and statistics methods through one request helper.

**How it fits:** No React component needs to know development proxy or production base-URL rules.

## `src/shared/components/`

**Purpose:** Holds `Navbar`, `Toast`, `ConfirmModal`, and `DateInputIL`.

**Why it exists:** These components are used across domains or implement application-wide behavior.

**Who calls it:** `App`, admin features, and opportunity form.

**What it receives:** State and callbacks from the caller.

**Main responsibilities:** Global navigation and responsive menu, transient feedback, safe destructive-action confirmation, and localized `DD/MM/YYYY` input over ISO dates.

**How it fits:** Shared components remain presentation-focused and do not directly mutate server data.

## `src/i18n/`

**Purpose:** Supplies all Hebrew and Arabic UI text.

**Why it exists:** Bilingual text must be centralized instead of duplicated in JSX.

**Who calls it:** Nearly all UI features through `useT(lang)`.

**What it receives:** Language, translation key, and optional variables.

**Main responsibilities:** Select `he.js` or `ar.js`, replace `{variable}` placeholders, set document language, and set the translated title.

**How it fits:** Data option modules also use the dictionaries to translate persisted values.

## `src/data/`

**Purpose:** Contains static organizations, opportunity option metadata, and gallery metadata.

**Why it exists:** Stable reference values are not runtime state and should not be buried in components.

**Who calls it:** Forms, filters, cards, statistics, gallery, and home.

**What it receives:** IDs or persisted Hebrew values when lookup helpers are used.

**Main responsibilities:** Map organization/city names, define categories/status/type/scope choices, and map gallery image files to captions/tags.

**How it fits:** It provides consistent identifiers and labels across features. The backend also has an organizations collection endpoint, but the current frontend organization selectors use this static module.

## `src/utils/`

**Purpose:** Contains reusable non-visual helpers.

**Why it exists:** Storage, dates, calendar math, schedule generation/display normalization, and role rules are easier to test and reuse as pure modules.

**Who calls it:** Application hooks, calendar, admin forms/panels, cards, and date input.

**What it receives:** Plain values and arrays.

**Main responsibilities:** Persist session/preferences; convert and validate Israeli dates; build month grids/date keys; generate event occurrences across a date range; normalize legacy and Admin-created opportunity schedules for consistent card/modal display; and calculate frontend staff permissions.

**How it fits:** Utilities know neither React rendering nor HTTP endpoints.

### Calendar Data Compatibility

The project supports two schedule representations during the transition from older data:

- The event API and `events` collection store generated occurrence documents with `startsAt` and `endTime`. This is the primary source for opportunities created or edited through the current admin workflow.
- Older opportunity documents may contain `eventDate`, `startTime`, and `endTime` directly.

`ScreenSwitcher` passes `store.events` to `EventsCalendar`. The `buildRegisteredCalendarEntries` utility converts each generated `startsAt` timestamp into the `eventDate` and `startTime` shape expected by the calendar UI. When an opportunity has no generated event documents, the utility falls back to its legacy `eventDate`. This keeps migrated records working while ensuring newly generated admin events appear in the personal calendar.

---

## Part 4 — Backend Structure

### Folder Overview

```text
api/
└── index.js                            Vercel serverless entry
server/
├── package.json                        backend scripts/dependencies
└── src/
    ├── index.js                        local Node process entry
    ├── app.js                          Express app and middleware order
    ├── db.js                           MongoDB connection singleton
    ├── middleware/
    │   ├── asyncHandler.js             forwards rejected promises
    │   └── connectDb.js                ensures database availability
    ├── routes/                         endpoint and HTTP verb declarations
    ├── controllers/                    request/response adapters
    ├── services/                       validation and business workflows
    ├── repositories/                   MongoDB queries/aggregations
    ├── models/
    │   ├── collections.js              collection name constants
    │   └── entities.js                 entity creation/sanitization
    └── utils/
        └── AppError.js                 controlled HTTP errors
```

There is no schema library or ORM. MongoDB documents are shaped by service/model functions, and repositories use the official driver directly.

## `server/src/index.js`

**Purpose:** Starts the local long-running HTTP server.

**Why it exists:** Port listening and process errors do not belong in the reusable Express app.

**Main responsibilities:** Eagerly begin MongoDB connection, listen on `PORT` or `3001`, print local URLs, and handle startup errors.

**How it fits:** Vite spawns this file in development; Vercel does not use it.

## `api/index.js`

**Purpose:** Exports the Express app as Vercel's serverless function.

**Why it exists:** A serverless platform owns the network listener.

**Main responsibilities:** Import and export `server/src/app.js` without calling `listen()`.

**How it fits:** It gives local and production execution two entries into the same application configuration.

## `server/src/app.js`

**Purpose:** Builds the Express application.

**Why it exists:** Middleware order and route wiring are global server configuration.

**Main responsibilities:** Register CORS/JSON/database middleware, mount all routers under `/api`, keep health independent from MongoDB, and translate forwarded errors into JSON/status codes.

**How it fits:** Both backend entry points reuse this exact app.

## `server/src/db.js`

**Purpose:** Owns MongoDB configuration and connection lifecycle.

**Why it exists:** Repositories need one connection pool rather than a client per request.

**Main responsibilities:** Load environment files, configure DNS, mask credentials in logs, connect with timeouts/pool size, cache/retry the connection promise, expose `getDb`, and close cleanly for scripts.

**How it fits:** Middleware calls `connectDb`; repositories call `getDb`.

## `server/src/middleware/connectDb.js` and `asyncHandler.js`

**Purpose:** Handle database readiness and asynchronous error forwarding.

**Why they exist:** These behaviors apply across endpoint families and should not be repeated in controllers.

**Main responsibilities:** Return `database_unavailable` if connection fails, and convert rejected controller promises into `next(error)` for the global handler.

**How they fit:** All database routes run after connection middleware, and route definitions wrap async controllers.

### Routes and API Contract

Route files only declare HTTP methods/paths and choose controllers. This makes the public API easy to scan.

| Method | Path | Route file | Main result |
|---|---|---|---|
| GET | `/api/health` | `health.js` | `{ ok: true }` without a DB requirement |
| GET | `/api/organizations` | `organizations.js` | Organization documents |
| POST | `/api/auth/login` | `auth.js` | Safe user or 401 |
| POST | `/api/auth/register` | `auth.js` | New safe youth user |
| GET | `/api/bootstrap` | `bootstrap.js` | Initial application datasets |
| POST | `/api/opportunities` | `opportunities.js` | New opportunity |
| PUT | `/api/opportunities/:id` | `opportunities.js` | Replaced/upserted opportunity |
| DELETE | `/api/opportunities/:id` | `opportunities.js` | Deletes opportunity and its events |
| POST | `/api/events` | `events.js` | New event |
| DELETE | `/api/events/:id` | `events.js` | Deletes one event |
| PUT | `/api/events/by-opportunity/:opportunityId` | `events.js` | Replaces all events for one opportunity |
| POST | `/api/views` | `views.js` | Records a unique user/opportunity view |
| POST | `/api/registrations` | `registrations.js` | Registration and optional profile update |
| DELETE | `/api/registrations` | `registrations.js` | Removes registration and records cancellation |
| GET | `/api/profiles/:userId` | `profiles.js` | Profile data or `null` |
| GET | `/api/users` | `users.js` | Safe user list |
| POST | `/api/users` | `users.js` | New safe user |
| PUT | `/api/users/:id` | `users.js` | Updated safe user |
| DELETE | `/api/users/:id` | `users.js` | Deletes a user |
| GET | `/api/stats` | `stats.js` | Aggregated dashboard data |

## `server/src/controllers/`

**Purpose:** Adapt Express requests and responses to service calls.

**Why it exists:** Services should not depend on `req`, `res`, route parameters, or HTTP response APIs.

**Main responsibilities:** Read bodies/parameters, convert numeric IDs, call the matching service, select `200` or `201`, and return JSON. `healthController` answers directly because it has no business or data operation.

**How it fits:** Every route points to a controller; controllers contain no MongoDB queries.

The files follow domain boundaries: `authController`, `bootstrapController`, `opportunityController`, `eventController`, `viewController`, `registrationController`, `profileController`, `userController`, `organizationController`, `statsController`, and `healthController`.

## `server/src/services/`

**Purpose:** Implement business rules and multi-repository workflows.

**Why it exists:** Validation and domain behavior should be independent of HTTP and database syntax.

**Main responsibilities by service:**

| Service | Responsibility |
|---|---|
| `authService.js` | Validate login/registration, reject duplicate usernames, assign youth role, hide passwords |
| `bootstrapService.js` | Convert profile document array into a `userId`-keyed object |
| `opportunityService.js` | Allocate IDs, create/replace opportunities, cascade event deletion |
| `eventService.js` | Allocate IDs and add/delete/replace event occurrences |
| `viewService.js` | Avoid duplicate views for the same opportunity/user pair |
| `registrationService.js` | Prevent duplicates, add registration, merge profile patch, remove registration, create cancellation history |
| `profileService.js` | Return profile data without its storage wrapper |
| `userService.js` | Validate admin CRUD input, enforce username uniqueness, return safe users |
| `statsService.js` | Build a complete 12-month series and normalize repository aggregation output |
| `organizationService.js` | List organizations through its repository |

**How it fits:** Controllers call services; services call repositories, models, and `AppError`.

## `server/src/repositories/`

**Purpose:** Contain every direct MongoDB operation.

**Why it exists:** Database collection names, filters, projections, writes, and pipelines should not leak into business services.

**Main responsibilities by repository:**

| Repository | Database work |
|---|---|
| `bootstrapRepository.js` | Parallel reads of six startup datasets, with sorting/projection |
| `counterRepository.js` | Atomic `$inc` sequence values for several entity types |
| `opportunityRepository.js` | Insert, replace/upsert, and delete by numeric ID |
| `eventRepository.js` | Insert/delete events and delete all by opportunity |
| `registrationRepository.js` | Find/insert/remove registration and insert cancellation |
| `profileRepository.js` | Find or upsert data by `userId` |
| `viewRepository.js` | Find and insert a view pair |
| `userRepository.js` | Credential/username lookup, safe projections, CRUD, and next user ID calculation |
| `organizationRepository.js` | Return organizations without Mongo `_id` |
| `statsRepository.js` | Counts, distinct organizations, lookups, grouping, sorting, and monthly aggregation pipelines |

**How it fits:** Repositories are the only normal runtime layer that imports `getDb()`.

## `server/src/models/collections.js` and `entities.js`

**Purpose:** Centralize collection identifiers and entity construction.

**Why they exist:** Storage names and safety rules should be consistent across repositories/services.

**Main responsibilities:** Define the nine collection names; create users, opportunity/event documents, registrations, cancellations, and views; strip `_id`; remove passwords from returned users; and construct partial user updates.

**How it fits:** Repositories import collection constants, while services use entity factories before writing or returning data.

## `server/src/utils/AppError.js`

**Purpose:** Represents expected application errors with HTTP information.

**Why it exists:** A service needs to report errors such as duplicate, invalid ID, missing fields, or not found without importing Express.

**Main responsibilities:** Carry `status`, `code`, and optional response `body`.

**How it fits:** `asyncHandler` forwards it and the global handler serializes it.

### Database Collections

| Collection | Purpose |
|---|---|
| `organizations` | Organization records returned by the organization endpoint |
| `users` | Login/account documents, including current stored password values |
| `opportunities` | Bilingual opportunity documents and current calendar display fields |
| `events` | Generated event occurrence documents |
| `registrations` | Active user-opportunity relationships |
| `cancellations` | Historical cancellation records |
| `views` | Opportunity view records for analytics |
| `profiles` | `{ userId, data }` registration-profile documents |
| `counters` | Sequence values used for numeric IDs |

Indexes are not created in the current repository code. Duplicate prevention for registrations/views is currently implemented by a read before insert, while counters provide atomic numeric sequences.

---

## Part 5 — How the Project Pieces Communicate

### User Action Flow Diagram

```text
Youth clicks "Register" in OpportunityDetailModal
    |
    v
useOpportunityWorkflow.requestRegistration()
    |
    +-- no user ----------> navigate to login + toast
    +-- wrong role -------> toast
    |
    v
RegistrationModal collects optional profile fields
    |
    v
useOpportunityWorkflow.confirmRegistration(profilePatch)
    |
    v
useApiStore.register(userId, opportunityId, profilePatch)
    |
    v
api.register() -> POST /api/registrations (JSON)
    |
    v
Express CORS -> JSON parser -> DB middleware
    |
    v
registrations route -> controller -> registration service
    |
    +--> registration repository -> registrations collection
    +--> counter repository ------> counters collection
    +--> profile repository ------> profiles collection (when supplied)
    |
    v
201 JSON { ok: true, registration }
    |
    v
useApiStore appends registration and merges cached profile
    |
    v
React re-renders overlays/pages; toast confirms success
```

### Dependency Table

| Who | Depends on | For |
|---|---|---|
| `src/main.jsx` | `src/App.jsx`, `src/index.css` | Start the React UI |
| `App.jsx` | app hooks, routes, overlays, shared navigation | Compose global state and UI |
| `ScreenSwitcher` | feature pages/containers | Choose the active screen |
| Feature pages | feature hooks/components, data, i18n, utils | Implement user-facing domains |
| Feature hooks | API store or API service | Coordinate async actions/state |
| `useApiStore` | `services/api.js` | Bootstrap and server mutations |
| `services/api.js` | Fetch and `/api` | HTTP/JSON transport |
| Express app | middleware and route modules | Configure request pipeline |
| Routes | controllers | Bind method/path to request handler |
| Controllers | services | Convert HTTP input/output |
| Services | repositories, models, `AppError` | Business rules and workflows |
| Repositories | `db.js`, collection constants | Execute MongoDB operations |
| `db.js` | MongoDB driver and environment | Manage the shared connection |
| Vercel rewrite | `api/index.js` | Route production API traffic to Express |

---

## Part 6 — Complete Main Flow

### Youth Registers for an Opportunity

1. **User action:** A visitor opens an opportunity card. `OpportunityCard` calls `onOpenModal(opportunity)`.
2. **Frontend workflow:** `useOpportunityWorkflow.openOpportunity` stores the selected opportunity and asks `useApiStore.recordView` to record the view.
3. **UI result:** `AppOverlays` renders `OpportunityDetailModal` and determines registration state with `store.isRegistered`.
4. **User action:** The youth clicks the registration button.
5. **Role decision:** `requestRegistration` sends guests to `login`, rejects staff/admin with a toast, or opens `RegistrationModal` for a youth user.
6. **Profile input:** `RegistrationModal` receives `store.getProfile(currentUser.id)`. If no settlement is present, it collects settlement and interest categories. Otherwise it sends `null` as the patch.
7. **Frontend function:** Confirmation calls `useOpportunityWorkflow.confirmRegistration`, which calls `store.register(userId, opportunityId, profilePatch)`.
8. **API request:** `api.register` sends `POST /api/registrations` with JSON `{ userId, opportunityId, profilePatch }`.
9. **Backend route/controller:** `routes/registrations.js` calls `registrationController.register`, which passes the request body to `registrationService.register`.
10. **Business rule:** The service uses `registrationRepository.find` to reject an existing user/opportunity pair with HTTP `409`.
11. **Database action:** The counter repository allocates the next registration ID, `entities.createRegistration` adds `createdAt`, and the registration repository inserts the document.
12. **Optional database action:** When `profilePatch` exists, the service reads the previous profile, merges it, and upserts `{ userId, data }`.
13. **Response:** The controller returns HTTP `201` with `{ ok: true, registration }`.
14. **Frontend state update:** `useApiStore` appends the returned registration and merges the profile cache. If the server returned `409`, it converts that to `{ ok: false, reason: "duplicate" }`.
15. **UI result:** The registration modal closes, a translated toast reports the outcome, and all pages using `registrations` re-render. The opportunity is now listed under My Registrations and can qualify for the personal calendar.

---

## Part 7 — Other Important Flows

### 1. Login and Browser Session

1. `LoginPage` validates username/password and calls `useAuthActions.login`.
2. `api.login` sends `POST /api/auth/login`.
3. `authService` asks `userRepository.findByCredentials` for an exact username/password match.
4. Invalid credentials become `AppError(401, "invalid_credentials")`.
5. A valid user passes through `toSafeUser`, removing `password` and `_id`.
6. `App.handleLogin` saves the user through `useSession` and routes staff/admin to `admin`, or youth to `opportunities`.
7. Refresh restores the safe user object from `localStorage`; no token is checked with the server.

### 2. Opening an Opportunity and Recording a View

1. A card, calendar item, or registration item calls `openOpportunity`.
2. The workflow immediately selects it for the detail modal.
3. `useApiStore.recordView` checks the already-loaded `views` array for the same `opportunityId` and user (or `null` guest).
4. If not present, it sends `POST /api/views`.
5. `viewService` performs a second database lookup, inserts a timestamped view only when missing, and returns either the new view or `skipped: true`.
6. The client appends a local view record after the API succeeds.

### 3. Cancelling a Registration

1. The youth confirms cancellation in `MyRegistrationsPage` or the detail modal.
2. `useOpportunityWorkflow.cancelRegistration` calls `store.unregister`.
3. `api.unregister` sends `DELETE /api/registrations` with the user/opportunity IDs in a JSON body.
4. `registrationService.unregister` removes the active registration.
5. If nothing was deleted, it returns a controlled `404`.
6. Otherwise it allocates a cancellation ID and inserts a timestamped cancellation record.
7. The frontend removes the registration from state, closes the matching selected opportunity if needed, and shows a toast.

### 4. Staff Creates or Edits an Opportunity

1. `StaffPanel` opens `OpportunityForm`; staff are restricted to their organization in the interface, while admins can choose any static organization.
2. The form validates bilingual titles, organization, city, complete start/end date and time fields, date order, and time order.
3. If a date range exists, `buildCalendarEvents` creates occurrence definitions.
4. Create calls `POST /api/opportunities`; edit calls `PUT /api/opportunities/:id`.
5. `opportunityService` creates the document and repository write. A new ID comes from the counters collection.
6. `StaffPanel` then calls `PUT /api/events/by-opportunity/:opportunityId` to replace occurrence documents.
7. `eventService` deletes old events and inserts newly numbered events one by one.
8. `useApiStore` updates opportunity/event arrays and the staff panel shows success feedback.

### 5. Statistics Dashboard

1. Opening the statistics tab mounts `StatsDashboard` and `useStatistics`.
2. The hook requests `GET /api/stats`.
3. `statsRepository` runs counts and aggregation pipelines in parallel, including `$lookup` joins from registrations to opportunities.
4. `statsService` creates a zero-filled last-12-month sequence and normalizes database keys.
5. The frontend localizes months, cities, categories, and Arabic opportunity titles.
6. Recharts components render KPI cards, monthly bars, distribution pies, top opportunities, and summary metrics.
7. While remote data loads, local bootstrap arrays produce fallback statistics; user/role information is unavailable in that fallback and displays accordingly.

---

## Part 8 — Why Every Layer Exists

### Application Composition

**Why it exists:** `src/app` keeps root routing, overlays, startup states, and global hooks separate from domain features.

**What breaks without it:** `App.jsx` becomes a large component that mixes every page and workflow, making global state changes risky.

### Pages and Feature Containers

**Why they exist:** A page/container represents a complete screen or domain coordinator, such as the opportunity board, home, users, or calendar.

**What breaks without them:** Screen-specific state and layout would be scattered through root routing or small presentation components.

### Components

**Why they exist:** Components isolate reusable or complex interface units such as cards, dialogs, forms, tables, and charts.

**What breaks without them:** UI behavior becomes duplicated, large, and inconsistent across screens.

### Hooks and State

**Why they exist:** Hooks keep lifecycle and workflows separate from rendered markup. The store keeps frontend state synchronized after API mutations.

**What breaks without them:** Pages would duplicate fetching, persistence, timers, filtering, and mutation state; updates in one screen would not automatically reach another.

### Frontend Service/API Client

**Why it exists:** All HTTP behavior needs one contract and one error/timeout policy.

**What breaks without it:** Every feature would build URLs, headers, timeouts, body serialization, and error parsing differently.

### Backend Routes

**Why they exist:** Routes define the public API surface by domain.

**What breaks without them:** Endpoint declarations and business code would accumulate in `app.js`, obscuring method/path ownership.

### Controllers

**Why they exist:** Controllers isolate Express-specific request/response work.

**What breaks without them:** Services become tied to HTTP objects and are harder to reuse or reason about.

### Services

**Why they exist:** Services own validation, entity creation, duplicate checks, cascades, profile merging, and aggregation normalization.

**What breaks without them:** Business rules move into controllers or repositories and become coupled to transport or MongoDB details.

### Repositories / Database Layer

**Why they exist:** Repositories are the single location for queries, projections, collection writes, and pipelines.

**What breaks without them:** MongoDB details spread through services, making database changes and query auditing difficult.

### Models

**Why they exist:** The project needs consistent collection names, entity timestamps/IDs, metadata stripping, and safe-user output even without an ORM.

**What breaks without them:** Document creation and password removal would be repeated and could become inconsistent.

### Middleware

**Why it exists:** CORS, JSON parsing, database readiness, and async error forwarding are cross-cutting request behavior.

**What breaks without it:** Every endpoint must repeat setup and error handling, or failed promises/connections may leave inconsistent responses.

### Utilities and Static Data

**Why they exist:** Pure date, schedule, permission, storage, and reference-data logic is needed by several features.

**What breaks without them:** Components duplicate formatting and rules, producing inconsistent organization names, dates, and permissions.

### Configuration and Entry Points

**Why they exist:** Vite configuration defines development behavior; Express configuration defines server behavior; Vercel configuration defines production routing.

**What breaks without them:** The two local processes, API proxy, static build, and serverless deployment would not connect correctly.

---

## Part 9 — Naming

| Name | Meaning and convention | Code that belongs there |
|---|---|---|
| `app` | Application-wide composition | Root routes, overlays, status screens, global hooks/data facade |
| `features` | Code grouped by user-facing business capability | Pages, components, hooks, and utilities specific to admin/auth/calendar/etc. |
| `pages` | Navigable full-screen destinations | Home, login, registration, catalog, gallery, personal registrations |
| `components` | Renderable UI units smaller than a page | Cards, forms, tables, dialogs, charts, calendar parts |
| `shared` | Code usable across several features | Navbar, toast, confirmation, date input |
| `hooks` | React functions beginning with `use` | Stateful workflows, effects, and derived data |
| `services` | Operations expressed in domain terms | Frontend HTTP methods; backend business rules |
| `routes` | Express endpoint declarations | HTTP method/path and controller selection |
| `controllers` | HTTP adapters | Read `req`, call service, write `res` |
| `repositories` | Persistence adapters | MongoDB reads, writes, projections, and aggregations |
| `models` | Entity/storage definitions | Collection constants and document creation/sanitization |
| `middleware` | Functions in the Express request chain | DB readiness and async error forwarding |
| `utils` | Reusable helpers with no primary UI role | Dates, storage, permissions, calendar/schedule math, `AppError` |
| `data` | Static reference data | Organizations, opportunity options, gallery metadata |
| `i18n` | Internationalization/localization | Translation dictionaries and translation helpers |
| `api` | Deployment-facing API entry | Vercel function exporting Express |
| `public` | Files served directly at root paths | Logo, icons, gallery images |

---

## Part 10 — Architecture Diagram

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Browser                                                                      │
│                                                                              │
│ index.html -> src/main.jsx -> src/App.jsx                                    │
│                              │                                               │
│             ┌────────────────┼──────────────────┐                            │
│             v                v                  v                            │
│       Global hooks      ScreenSwitcher.jsx AppOverlays.jsx                   │
│       - useSession      manual switch      detail/register modals            │
│       - preferences          │                                               │
│       - toast                v                                               │
│       - useApiStore     Feature modules                                      │
│             │          ┌────────┬─────────┬──────────┬─────────┐              │
│             │          │ auth   │ opps    │ calendar │ admin   │ ...          │
│             │          │ pages  │ hooks   │ parts    │ users   │              │
│             │          │ hook   │ cards   │          │ stats   │              │
│             │          └────────┴─────────┴──────────┴─────────┘              │
│             │                    │                                           │
│             └──────────┬─────────┘                                           │
│                        v                                                     │
│                 src/services/api.js                                          │
│             Fetch + JSON + 15 s timeout                                      │
└────────────────────────┬─────────────────────────────────────────────────────┘
                         │ HTTP /api/*
            Development  │ Vite proxy -> localhost:3001
            Production   │ Vercel rewrite -> api/index.js
                         v
┌──────────────────────────────────────────────────────────────────────────────┐
│ Express application: server/src/app.js                                      │
│                                                                              │
│ cors -> express.json -> /health -> connectDb middleware -> domain routes     │
│                                                               │              │
│                                                               v              │
│  routes/                                                               │     │
│  health auth bootstrap opportunities events views registrations       │     │
│  profiles users organizations stats                                  │     │
│       │                                                                      │
│       v                                                                      │
│  controllers/   request/body/params -> service -> JSON/status                │
│       │                                                                      │
│       v                                                                      │
│  services/      validation, IDs, workflows, normalization, errors            │
│       │                  │                                                   │
│       │                  └--> models/entities.js + utils/AppError.js          │
│       v                                                                      │
│  repositories/  MongoDB queries, writes, projections, aggregations           │
│       │                                                                      │
│       v                                                                      │
│  db.js          cached MongoClient / connection pool                         │
│                                                                              │
│  final global error handler -> controlled JSON response                      │
└────────────────────────┬─────────────────────────────────────────────────────┘
                         v
┌──────────────────────────────────────────────────────────────────────────────┐
│ MongoDB (`MONGODB_DB`, default `eshkol`)                                     │
│                                                                              │
│ organizations | users | opportunities | events | registrations               │
│ cancellations | views | profiles | counters                                 │
└──────────────────────────────────────────────────────────────────────────────┘

External/runtime inputs:
- `.env`: MongoDB URI and database name
- Google public DNS configured by db.js for SRV resolution
- Google Fonts loaded by index.html (Heebo)
- Vercel deployment/proxy layer in production
```

---

## Part 11 — Final Summary

### Where does the project actually start?

In the browser, it starts from `index.html`, which executes `src/main.jsx`. In a local backend process, it starts from `server/src/index.js`. In Vercel production API execution, the backend entry is `api/index.js`.

### What is the first file that executes?

For frontend JavaScript, `src/main.jsx` is first. For the normal Node server, `server/src/index.js` is first. Module imports cause `server/src/app.js` and its route graph to be evaluated before `server/src/index.js` starts listening.

### What is the root component/server entry responsible for?

`App.jsx` composes global browser state, navigation guards, status handling, routes, overlays, and shared UI. `server/src/index.js` starts the local listener and eager database connection; `server/src/app.js` defines the reusable server request pipeline.

### What is the difference between Pages and Components?

A page is a complete destination chosen by `ScreenSwitcher`, such as `HomePage`, `LoginPage`, or `OpportunitiesBoardPage`. A component is a focused part used inside a page or overlay, such as `OpportunityCard`, `CalendarGrid`, or `ConfirmModal`. Some feature containers such as `EventsCalendar` and `StaffPanel` function as screens even though their folder is named `components`.

### Why do we have Services?

The frontend service gives every feature one consistent HTTP client. Backend services keep business rules—duplicate detection, validation, cascades, profile merging, safe user handling, and statistics shaping—separate from Express and MongoDB syntax.

### Why do we have Routes / Controllers?

Routes make the API paths and verbs explicit. Controllers translate HTTP-shaped inputs into service calls and translate service results back into status codes and JSON. This prevents HTTP details from entering the business layer.

### Why do we have Middleware?

Middleware applies behavior needed across requests: CORS headers, JSON parsing, database readiness, and rejected-promise forwarding. The health endpoint is intentionally mounted before database middleware.

### How does the database connect to everything?

`db.js` owns one cached MongoDB client and database object. Middleware ensures it is connected, repositories obtain it with `getDb()`, services call repositories, controllers call services, and routes expose controllers. The frontend never connects to MongoDB directly.

### What happens internally when a user performs any action?

A component calls a callback or hook. If the action needs persistence, the hook/store calls `api.js`, which sends JSON to Express. Middleware runs, a route selects a controller, the controller calls a service, and the service uses repositories/models to read or change MongoDB. JSON returns through the same layers, React state updates, and React re-renders the affected UI.

### If I had to explain this architecture to my lecturer in 5 minutes, what would I say?

> Eshkol Bet Hakerem is a full-stack JavaScript platform for youth opportunities in Hebrew and Arabic. The frontend is a React Single Page Application built with Vite and Tailwind. It does not use React Router; a saved `currentScreen` value and `ScreenSwitcher` choose the visible screen. `App.jsx` is the composition root, while domain code is organized into features such as authentication, opportunities, registrations, calendar, and administration.
>
> The frontend loads its main data once through `GET /api/bootstrap` and keeps it in a custom React hook called `useApiStore`. Focused hooks manage the session, preferences, notifications, filters, registration workflow, users, and statistics. All HTTP calls go through one Fetch wrapper with JSON handling and a timeout.
>
> The backend is an Express REST API organized into routes, controllers, services, and repositories. Routes define paths, controllers handle HTTP, services contain rules, and repositories are the only normal runtime modules that query MongoDB. Shared middleware handles CORS, JSON, database connection, and asynchronous errors.
>
> Locally, Vite starts both the frontend and Express and proxies `/api` to port 3001. In production, Vercel serves the Vite build and sends `/api` requests to the same Express app through `api/index.js`. MongoDB stores users, opportunities, events, registrations, cancellations, views, profiles, organizations, and counters.
>
> The main strength is separation of responsibilities: UI, browser workflows, HTTP transport, server business rules, and persistence each have a clear layer. The main current limitations to mention are that navigation is state-based rather than URL-based and authentication is browser-local with no backend authorization middleware. Calendar data has both generated events and legacy opportunity dates, so a frontend compatibility utility normalizes both representations for display.
