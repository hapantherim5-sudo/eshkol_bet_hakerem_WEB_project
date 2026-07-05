# MongoDB Database Guide

This document describes the MongoDB database used by Eshkol Bet Hakerem: collection purposes, known document fields, relationships, read/write paths, access rules, deletion behavior, analytics, indexes, and current data-integrity limitations.

## Documentation Scope

The schema below is derived from the current models, services, repositories, frontend forms, and historical seed definitions. MongoDB is schema-less and the application does not install collection validators, so the tables describe fields known to and used by the application—not a database-enforced JSON Schema.

`opportunities`, `events`, and `profiles.data` currently accept pass-through properties. Additional fields can therefore exist if older data or an API client supplied them.

A read-only inspection of the configured Atlas database was attempted without requesting or printing document values. The connection was unavailable in the current environment (`MongoServerSelectionError` caused by `MongoNetworkError`), so this guide does not claim live document counts or currently installed indexes. Index information is separated into historical and recommended definitions.

No connection URI, database password, token secret, or real user record is included in this document.

---

## Connection and Runtime Configuration

| Item | Current behavior |
|---|---|
| Driver | Official Node.js `mongodb` driver |
| Connection module | `server/src/db.js` |
| URI | `MONGODB_URI`; defaults to `mongodb://127.0.0.1:27017` |
| Database name | `MONGODB_DB`; defaults to `eshkol` |
| Pool | One cached `MongoClient`, maximum pool size 10 |
| Server selection timeout | 10 seconds |
| Connection timeout | 10 seconds |
| Socket timeout | 45 seconds |
| DNS | Google public DNS is configured for SRV resolution |
| Environment files | Root `.env`, then `server/.env` |
| API readiness | `/api/health` runs without MongoDB; all other API routes run after connection middleware |

The database client and selected database are cached. Concurrent callers share the same in-flight connection promise. A failed connection resets that promise so a later request can retry.

### Secret handling

- `.env` is ignored by Git and must never be committed.
- `.env.example` contains placeholders only.
- MongoDB credentials should be rotated if they appear in chat, screenshots, logs, or source control.
- `AUTH_SECRET` is separate from MongoDB credentials and should be a long random production value.

---

## Collection Overview

The canonical names are defined in `server/src/models/collections.js`.

| Collection | Purpose | Primary application key |
|---|---|---|
| `organizations` | Organization reference records | String `id` |
| `users` | Login accounts and role/organization identity | Numeric `id`; string `username` |
| `opportunities` | Bilingual youth opportunity definitions and schedules | Numeric `id` |
| `events` | Dated calendar occurrences generated from opportunities | Numeric `id`; numeric `opportunityId` |
| `registrations` | Active user-to-opportunity registrations | Numeric `id`; pair `(userId, opportunityId)` |
| `cancellations` | Historical registration cancellations | Numeric `id` |
| `views` | Unique opportunity views by a user or guest | Pair `(opportunityId, userId)` |
| `profiles` | Additional registration profile data for a user | Numeric `userId` |
| `counters` | Numeric sequence state for application IDs | One logical singleton document |

Every MongoDB document also receives an internal `_id`—normally an `ObjectId`—unless one is explicitly supplied. API projections generally remove `_id`; application code uses the domain keys listed above.

---

## Relationship Diagram

```text
organizations.id (string)
    ├──< users.organizationId
    ├──< opportunities.organizationId
    └──< events.organizationId

users.id (number)
    ├──< registrations.userId >── opportunities.id
    ├──< cancellations.userId  >── opportunities.id
    ├──< views.userId          >── opportunities.id
    └─── profiles.userId

opportunities.id (number)
    └──< events.opportunityId

counters
    ├── opportunities -> next opportunities.id
    ├── events         -> next events.id
    ├── registrations  -> next registrations.id
    ├── cancellations  -> next cancellations.id
    └── users          -> next users.id
```

MongoDB does not enforce these as foreign keys. The services validate some parent records before insert and perform manual cascade cleanup on deletion.

---

## Field and Type Conventions

| Convention | Meaning |
|---|---|
| Numeric domain IDs | JavaScript/MongoDB numbers used for users, opportunities, events, registrations, and cancellations |
| Organization IDs | Stable strings such as an organization slug |
| Date-only fields | ISO-like string `YYYY-MM-DD` |
| Time-only fields | String `HH:mm` |
| Timestamp fields | ISO 8601 strings created with `new Date().toISOString()` |
| Bilingual fields | Hebrew base field plus an `Ar` field, for example `title` and `titleAr` |
| Optional values | May be missing, an empty string, or in some update paths `null` |
| Mongo `_id` | Internal storage identity; normally excluded from API responses |

Dates are stored as strings rather than BSON `Date` values. Statistics pipelines convert `createdAt` and `cancelledAt` with `$toDate` before grouping.

---

## 1. `organizations`

### Purpose

Stores the organizations that operate opportunities or own staff accounts. The current frontend also has a static organization list in `src/data/organizations.js`.

### Known fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal MongoDB identity |
| `id` | `string` | Yes | Stable organization identifier referenced by other collections |
| `nameHe` | `string` | Historical seed | Hebrew display name in previously seeded database records |
| `nameAr` | `string` | Historical seed | Arabic display name in previously seeded database records |
| `nameKey` | `string` | Current static frontend only | Translation key used by the current in-code organization list; not currently written by the API |

### Current behavior

- `GET /api/organizations` returns all documents with `_id` removed.
- There is no current create/update/delete endpoint.
- There is no current organization model validator.
- Current UI selectors use the static frontend list rather than the database endpoint.
- Staff authorization compares `users.organizationId` with `opportunities.organizationId` as exact strings.

Because the runtime repository returns raw organization documents, database records should use one consistent naming format. If the endpoint becomes a primary UI source, migrate the collection and frontend to a single agreed schema.

---

## 2. `users`

### Purpose

Stores authentication credentials, user identity, roles, and optional staff organization ownership.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal MongoDB identity |
| `id` | `number` | Yes | Application user ID |
| `name` | `string` | Yes | Trimmed full display name |
| `username` | `string` | Yes | Trimmed login name |
| `password` | `string` | Yes | Current stored password value |
| `role` | `string` | Yes | `User`, `Staff`, or `Admin` |
| `organizationId` | `string \| null` | Staff required | Organization owned by staff; optional for User/Admin |

### Read and write behavior

```text
Login
└── findOne({ username, password })

Safe user responses
└── projection removes password and _id

Create
├── validate required fields and role
├── reject existing username
├── allocate monotonic numeric ID
└── insertOne(user)

Update
├── validate supplied fields
├── reject username conflict
└── updateOne({ id }, { $set: patch })
```

### Security warning

Passwords are currently trimmed and stored/compared directly. They are excluded from normal API responses, but they are not hashed at rest. Production hardening must migrate them to salted one-way password hashes such as Argon2id or bcrypt and replace exact database credential lookup with hash verification.

### User deletion cascade

Deleting a user also deletes documents matching that `userId` from:

- `registrations`
- `cancellations`
- `views`
- `profiles`

Opportunities and events are not deleted when a staff/admin account is deleted.

---

## 3. `opportunities`

### Purpose

Stores the main bilingual opportunity record, its ownership, audience metadata, registration details, and current or legacy schedule fields.

### Current fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `id` | `number` | Yes | Application opportunity ID |
| `icon` | `string` | No | Emoji/icon displayed by cards and calendar |
| `title` | `string` | Yes | Hebrew title |
| `titleAr` | `string` | Yes | Arabic title |
| `category` | `string` | No | Category ID: `sport`, `art`, `volunteer`, `science`, `community`, or `workshops` |
| `categoryLabel` | `string` | No/legacy | Stored Hebrew category label used by older data/search |
| `type` | `string` | No | Opportunity type; current Hebrew values include חוג, סדנה, תנועת נוער, התנדבות, מיזם, הכשרה, תוכנית |
| `scope` | `string` | No | Current Hebrew values: יישובי or אזורי |
| `city` | `string` | Yes | Municipality/city lookup value |
| `cityAr` | `string` | Legacy | Previously stored Arabic city name |
| `organizationId` | `string` | Yes | Owning organization; authorization boundary for Staff |
| `ageMin` | `number` | No | Minimum participant age |
| `ageMax` | `number` | No | Maximum participant age |
| `description` | `string` | No | Hebrew description |
| `descriptionAr` | `string` | No | Arabic description |
| `contact` | `string` | No | Contact person/organization text |
| `phone` | `string` | No | Contact phone stored as text |
| `registration` | `string` | No | Hebrew registration instructions/method |
| `registrationAr` | `string` | No | Arabic registration instructions/method |
| `status` | `string` | No | Hebrew status: פתוח, מקומות אחרונים, נסגר בקרוב, or סגור להרשמה |
| `startDate` | `string` | Current schedule | First date, `YYYY-MM-DD` |
| `endDate` | `string` | Current schedule | Last date, `YYYY-MM-DD` |
| `time` | `string` | Current schedule | Start time, normally `HH:mm` |
| `endTime` | `string` | Current schedule | End time, normally `HH:mm` |
| `days` | `string` | Optional/legacy | Hebrew weekday/repetition description used during event generation |
| `daysAr` | `string` | Legacy | Arabic weekday/repetition description |
| `eventDate` | `string` | Legacy schedule | Single activity date, `YYYY-MM-DD` |
| `startTime` | `string` | Legacy schedule | Legacy explicit start time |

### Validation

- `title`, `titleAr`, `organizationId`, and `city` must be non-empty.
- Current schedules require all four fields: `startDate`, `endDate`, `time`, and `endTime`.
- Legacy records are accepted when `eventDate` and `startTime`/`time` exist.
- `endDate` cannot precede `startDate`.
- `endTime` must be later than `time`.
- Staff may create or modify only opportunities whose `organizationId` matches their user record.
- Admin may manage every organization.

### Flexible-schema note

`createOpportunity` copies every input property except `_id` and then sets the numeric `id`. Unknown fields are therefore currently persisted. Server-side allow-listing or MongoDB schema validation is recommended.

### Opportunity deletion cascade

Deleting an opportunity deletes:

- The opportunity document.
- All `events` with the same `opportunityId`.
- All `registrations` with the same `opportunityId`.
- All `cancellations` with the same `opportunityId`.
- All `views` with the same `opportunityId`.

Profiles and users are retained.

---

## 4. `events`

### Purpose

Stores dated calendar occurrences. One opportunity may generate multiple event documents over a date range.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `id` | `number` | Yes | Application event ID |
| `opportunityId` | `number` | Yes for current events | Parent opportunity ID |
| `title` | `string` | Yes/current generation | Hebrew title copied from the opportunity |
| `titleAr` | `string` | No | Arabic title copied from the opportunity |
| `organizationId` | `string` | No | Organization copied from the opportunity |
| `city` | `string` | No | City copied from the opportunity |
| `startsAt` | `string` | Yes | ISO 8601 event start timestamp |
| `endTime` | `string` | No | Time-only end value, normally `HH:mm` |

### Behavior

- Parent opportunity existence and staff ownership are validated before current event writes.
- Replacing events deletes all existing events for the opportunity and inserts newly generated records.
- Legacy orphan events without `opportunityId` can be deleted only by Admin.
- `createEvent` copies pass-through input properties except `_id`, so legacy/additional fields may exist.

---

## 5. `registrations`

### Purpose

Represents an active registration between one user and one opportunity.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `id` | `number` | Yes | Application registration ID |
| `userId` | `number` | Yes | Registered user ID |
| `opportunityId` | `number` | Yes | Registered opportunity ID |
| `createdAt` | `string` | Yes | ISO 8601 registration timestamp |

### Behavior

- Only authenticated users with role `User` may register.
- The controller overwrites any client-provided `userId` with `req.user.id`.
- The opportunity must exist.
- The service performs a duplicate lookup on `(userId, opportunityId)` before insertion.
- A successful optional `profilePatch` is merged into the user's `profiles` document.

Without a unique compound index, the read-before-insert duplicate check remains vulnerable to two concurrent requests.

---

## 6. `cancellations`

### Purpose

Stores cancellation history after an active registration is removed.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `id` | `number` | Yes | Application cancellation ID |
| `userId` | `number` | Yes | User who cancelled |
| `opportunityId` | `number` | Yes | Cancelled opportunity |
| `cancelledAt` | `string` | Yes | ISO 8601 cancellation timestamp |

### Behavior

The cancellation workflow first removes the active registration. If deletion succeeds, it allocates a cancellation ID and inserts the history record. Cancellation records are used by statistics and role-filtered bootstrap data.

---

## 7. `views`

### Purpose

Stores an opportunity view for analytics while attempting to avoid duplicate views by the same identity.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `opportunityId` | `number` | Yes | Viewed opportunity ID |
| `userId` | `number \| null` | Yes | Authenticated user ID or `null` for a guest |
| `viewedAt` | `string` | Yes | ISO 8601 view timestamp |

### Behavior

- The opportunity must exist.
- Authenticated identity comes from the verified token, not the request body.
- Guests are stored with `userId: null`.
- The service checks `(opportunityId, userId)` before insertion.
- There is no separate numeric view ID or counter.

All guests currently share the `null` identity, so only one guest view per opportunity is normally recorded. This is a deliberate consequence of the current model, not unique visitor tracking.

---

## 8. `profiles`

### Purpose

Stores additional user registration preferences separately from the login account.

### Fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `userId` | `number` | Yes | Owner user ID |
| `data` | `object` | Yes | Merged profile payload |
| `data.settlement` | `string` | Current UI | User municipality/settlement |
| `data.interests` | `string[]` | Current UI | Selected category IDs |

### Behavior

- `upsert(userId, data)` creates or updates one profile document.
- Registration merges a new patch over existing `data`.
- `GET /api/profiles/:userId` is restricted to the same user or Admin.
- Youth bootstrap includes only the authenticated user's profile.
- Staff bootstrap includes no profiles.
- Admin bootstrap includes all profiles.

`profilePatch` does not currently have an allow-list or nested schema validation. Additional properties can be stored inside `data`.

---

## 9. `counters`

### Purpose

Stores sequence values used to allocate numeric application IDs atomically.

### Known fields

| Field | Type | Required | Description |
|---|---|---:|---|
| `_id` | `ObjectId` | MongoDB | Internal identity |
| `opportunities` | `number` | As used | Last allocated opportunity ID |
| `events` | `number` | As used | Last allocated event ID |
| `registrations` | `number` | As used | Last allocated registration ID |
| `cancellations` | `number` | As used | Last allocated cancellation ID |
| `users` | `number` | As used | Last allocated user ID |

### Allocation behavior

`nextId(counterKey)` performs atomic `$inc` with `findOneAndUpdate`. `nextIdAtLeast(counterKey, floor)` first raises the stored value with `$max`, then increments it.

User allocation computes the highest numeric ID referenced by `users`, `registrations`, `cancellations`, `views`, and `profiles`. This prevents reuse of an old deleted user ID that still appears in historical/orphaned records.

### Singleton limitation

Counter operations query with `{}` rather than a fixed `_id`. The design assumes exactly one counter document. Multiple documents would make sequence selection ambiguous. A safer design would use one document with a fixed key such as `_id: "sequences"`, or one document per sequence.

---

## CRUD and Access Matrix

| Collection | Read paths | Write paths | API access |
|---|---|---|---|
| `organizations` | Organization endpoint | No current endpoint | Public read |
| `users` | Login, Admin users, auth middleware, stats | Public youth registration; Admin CRUD | Public auth; Admin management |
| `opportunities` | Public bootstrap, management, stats | Staff/Admin create/update/delete | Public read; Staff/Admin write |
| `events` | Public bootstrap/calendar | Staff/Admin create/delete/replace | Public read; Staff/Admin write |
| `registrations` | Role-filtered bootstrap, stats | Youth register/unregister; cascades | User self-write; Staff scoped read; Admin read |
| `cancellations` | Role-filtered bootstrap, stats | Created on unregister; cascades | No direct endpoint |
| `views` | Role-filtered bootstrap, stats | Public/authenticated view recording; cascades | Public write with server-derived identity |
| `profiles` | Self/Admin endpoint and bootstrap | Upsert during registration | Self/Admin read; User self-write indirectly |
| `counters` | ID allocation only | Atomic sequence updates | Internal only |

---

## Bootstrap Data Privacy

`GET /api/bootstrap` reads six collections in parallel: `opportunities`, `events`, `registrations`, `cancellations`, `views`, and `profiles`.

| Caller | Returned private data |
|---|---|
| Guest | No registrations, cancellations, views, or profiles |
| `User` | Only records whose `userId` equals the authenticated user; own profile only |
| `Staff` | Registrations/cancellations/views only for opportunities owned by their organization; no profiles |
| `Admin` | Complete datasets |

Opportunities and events are public for every caller.

---

## Statistics and Aggregations

The statistics repository uses:

- `countDocuments` for users, opportunities, registrations, cancellations, and views.
- `distinct("organizationId")` on opportunities for active organization count.
- `$toDate`, `$match`, and `$group` for monthly registration/cancellation series.
- `$lookup` from registrations to opportunities using `registration.opportunityId -> opportunity.id`.
- Grouping by opportunity city and category.
- Top-ten opportunity registration counts.
- User grouping by role.

Orphan registrations are excluded from city/category aggregation because `$unwind` does not preserve an empty opportunity lookup in those pipelines.

---

## Index Status

### Runtime status

Current runtime code does not call `createIndex`, and the live database could not be inspected from this environment. Therefore no non-default index should be assumed to exist without checking Atlas or MongoDB Compass.

An older seed script created the following indexes:

- Unique `opportunities.id`.
- Unique `events.id`.
- Non-unique `events.opportunityId`.
- Unique compound `(registrations.userId, registrations.opportunityId)`.
- Unique `users.username`.
- Unique `profiles.userId`.

These are historical definitions, not proof of current Atlas state.

### Recommended indexes

| Collection | Index | Reason |
|---|---|---|
| `users` | `{ id: 1 }`, unique | Stable application identity |
| `users` | `{ username: 1 }`, unique | Prevent duplicate login names |
| `users` | `{ organizationId: 1 }` | Staff/organization filtering |
| `opportunities` | `{ id: 1 }`, unique | Parent lookups and management |
| `opportunities` | `{ organizationId: 1 }` | Staff ownership filtering |
| `events` | `{ id: 1 }`, unique | Event lookup/delete |
| `events` | `{ opportunityId: 1 }` | Calendar loading and cascade delete |
| `events` | `{ startsAt: 1 }` | Date-range calendar queries if moved server-side |
| `registrations` | `{ id: 1 }`, unique | Registration identity |
| `registrations` | `{ userId: 1, opportunityId: 1 }`, unique | Enforce one active registration per user/opportunity |
| `registrations` | `{ opportunityId: 1 }` | Statistics and cascade delete |
| `cancellations` | `{ id: 1 }`, unique | Cancellation identity |
| `cancellations` | `{ userId: 1 }` | User cleanup/bootstrap |
| `cancellations` | `{ opportunityId: 1 }` | Statistics and cascade delete |
| `views` | `{ opportunityId: 1, userId: 1 }`, unique | Enforce current view-deduplication rule |
| `views` | `{ userId: 1 }` | User cleanup/bootstrap |
| `profiles` | `{ userId: 1 }`, unique | One profile per user |

Before adding unique indexes, inspect and resolve existing duplicates; MongoDB will reject unique-index creation when duplicate keys already exist.

---

## Data Integrity and Transaction Notes

### Current protections

- Numeric counters use atomic increments.
- Parent opportunity existence is checked before event, registration, and view insertion.
- Staff ownership is enforced server-side.
- Authenticated `userId` comes from the token for registrations, cancellations, and views.
- Opportunity and user deletion perform related-data cleanup.
- Passwords and `_id` are removed from normal user responses.

### Current limitations

1. Passwords are stored in directly comparable form rather than salted hashes.
2. No MongoDB JSON Schema validators are installed by runtime code.
3. Duplicate checks use read-before-write and require unique indexes for concurrency safety.
4. Cascades are multiple operations without a transaction; a mid-operation failure can leave partial cleanup.
5. Opportunity replacement is full-document replacement, so omitted fields are removed.
6. Pass-through opportunity/event/profile properties allow unknown fields.
7. Dates are strings and invalid legacy values can cause `$toDate` aggregation failures.
8. The counters collection assumes one document but does not enforce singleton identity.
9. Organization documents and the current static frontend organization shape are not fully unified.

---

## Recommended Hardening Roadmap

1. Rotate any MongoDB credential that has been exposed and restrict Atlas network access.
2. Hash all passwords with Argon2id or bcrypt and migrate existing accounts.
3. Audit live indexes, clean duplicates, and install the recommended unique/lookup indexes.
4. Add MongoDB `$jsonSchema` validators for each collection.
5. Replace input pass-through with explicit server-side field allow-lists.
6. Use transactions for registration/profile writes and multi-collection cascades when the deployment supports them.
7. Give the counters document a fixed `_id`.
8. Normalize organization storage and remove the duplicate static/database source of truth.
9. Consider BSON `Date` values for timestamps and consistent date handling.
10. Add automated migration and integrity-audit scripts rather than editing production documents manually.

---

## Main Source Files

| Concern | File/location |
|---|---|
| Collection names | `server/src/models/collections.js` |
| Entity construction and safe users | `server/src/models/entities.js` |
| MongoDB connection | `server/src/db.js` |
| Queries and writes | `server/src/repositories/` |
| Validation, ownership, and workflows | `server/src/services/` |
| Authentication middleware | `server/src/middleware/auth.js` |
| API route access | `server/src/routes/` |
| Current opportunity form schema | `src/features/admin/opportunities/components/OpportunityForm.jsx` |
| Profile input schema | `src/features/opportunities/components/RegistrationModal.jsx` |
| Static organization IDs | `src/data/organizations.js` |
| Schedule/event generation | `src/utils/scheduleEvents.js` |
| Database configuration template | `.env.example` |

For the full application architecture see `Architecture_Guide.md`. For the complete function call inventory see `FUNCTION_TREE.md`.
