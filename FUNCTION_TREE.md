# Project Function Tree

This document maps the named functions, React components, hooks, API methods, middleware, services, and persistence functions in the project.

The inventory is organized by responsibility and call flow. Small anonymous callbacks passed directly to `map`, `filter`, `useEffect`, event props, or Promise methods are intentionally excluded. Named callbacks and functions returned from hooks are included.

## End-to-End Overview

```text
Browser
└── src/main.jsx
    └── App
        ├── Global hooks and API-backed store
        ├── ScreenSwitcher
        │   └── Feature pages and components
        └── AppOverlays
            └── Opportunity and registration dialogs

User action
└── Component / page
    └── Feature hook or useApiStore
        └── api.<operation>
            └── request
                └── Express middleware
                    └── Route
                        └── Controller
                            └── Service
                                └── Repository
                                    └── MongoDB
```

---

## Frontend Application Tree

```text
src/main.jsx
└── App
    ├── handleLogin
    ├── handleLogout
    ├── handleNavigate
    ├── useApiStore
    ├── useAppPreferences
    ├── useSession
    ├── useToast
    ├── useOpportunityFilters
    ├── useOpportunityWorkflow
    ├── ScreenSwitcher
    └── AppOverlays
```

### Application composition

```text
src/app/App.jsx
├── App
├── handleLogin
├── handleLogout
└── handleNavigate

src/app/AppOverlays.jsx
└── AppOverlays

src/app/AppStatus.jsx
├── LoadingScreen
└── LoadErrorScreen

src/app/ScreenSwitcher.jsx
└── ScreenSwitcher
```

### Global hooks

```text
src/app/hooks/useAppPreferences.js
└── useAppPreferences
    ├── toggleTheme
    └── toggleLanguage

src/app/hooks/useSession.js
└── useSession
    ├── signIn
    └── signOut

src/app/hooks/useToast.js
└── useToast
    └── showToast
```

### API-backed application store

```text
src/app/store/useApiStore.js
└── useApiStore
    ├── applyBootstrap
    ├── reload
    ├── addOpportunity
    ├── updateOpportunity
    ├── deleteOpportunity
    ├── replaceEventsForOpportunity
    ├── recordView
    ├── register
    ├── unregister
    ├── isRegistered
    └── getProfile
```

### Frontend HTTP client

```text
src/services/api.js
├── request
└── api
    ├── bootstrap
    ├── login
    ├── registerUser
    ├── addOpportunity
    ├── updateOpportunity
    ├── deleteOpportunity
    ├── replaceEventsForOpportunity
    ├── recordView
    ├── register
    ├── unregister
    ├── getUsers
    ├── createUser
    ├── updateUser
    ├── deleteUser
    └── getStats
```

### Development configuration

```text
vite.config.js
└── auto-express.configureServer
    └── stop
```

`configureServer` starts the local Express process when Vite starts. `stop` terminates that child process when the Vite server closes.

---

## Frontend Feature Functions

### Authentication

```text
src/features/auth/hooks/useAuthActions.js
└── useAuthActions
    ├── login
    └── register

src/features/auth/pages/LoginPage.jsx
└── LoginPage
    └── handleLogin

src/features/auth/pages/RegisterPage.jsx
└── RegisterPage
    └── handleRegister
```

### Opportunities

```text
src/features/opportunities/hooks/useOpportunityFilters.js
└── useOpportunityFilters
    └── clearFilters

src/features/opportunities/hooks/useOpportunityWorkflow.js
└── useOpportunityWorkflow
    ├── openOpportunity
    ├── closeOpportunity
    ├── closeRegistration
    ├── requestRegistration
    ├── confirmRegistration
    └── cancelRegistration

src/features/opportunities/pages/OpportunitiesBoardPage.jsx
├── OpportunitiesBoardPage
│   ├── close
│   └── dropdown
├── FilterField
└── CategoryButton

src/features/opportunities/components/FilterDropdown.jsx
└── FilterDropdown

src/features/opportunities/components/OpportunityCard.jsx
└── OpportunityCard

src/features/opportunities/components/OpportunityDetailModal.jsx
└── OpportunityDetailModal
    ├── closeModal
    └── handleKeyDown

src/features/opportunities/components/RegistrationModal.jsx
└── RegistrationModal
    ├── toggleInterest
    └── handleConfirm
```

### Admin opportunity management

```text
src/features/admin/opportunities/pages/StaffPanel.jsx
└── StaffPanel
    ├── positionFormWindow
    ├── handleSave
    ├── handleDelete
    └── handleTabChange

src/features/admin/opportunities/components/OpportunityForm.jsx
├── empty
└── OpportunityForm
    ├── set
    └── handleSubmit
```

### Admin user management

```text
src/features/admin/users/UserManagement.jsx
└── UserManagement
    ├── handleLoadError
    ├── saveUser
    └── deleteUser

src/features/admin/users/hooks/useUsers.js
└── useUsers
    ├── reload
    ├── createUser
    ├── updateUser
    └── deleteUser

src/features/admin/users/components/UserFilters.jsx
└── UserFilters
    └── update

src/features/admin/users/components/UserFormModal.jsx
├── emptyUser
├── UserFormModal
│   ├── update
│   └── submit
└── Field

src/features/admin/users/components/UsersTable.jsx
└── UsersTable
    └── roleLabel
```

### Admin statistics

```text
src/features/admin/statistics/StatsDashboard.jsx
└── StatsDashboard
    ├── handleError
    └── localizeMonths

src/features/admin/statistics/hooks/useStatistics.js
└── useStatistics

src/features/admin/statistics/utils/computeLocalStats.js
├── computeLocalStats
│   ├── groupByMonth
│   ├── groupBy
│   └── opportunityFor
└── getLast12Months

src/features/admin/statistics/components/DistributionCharts.jsx
├── DistributionCharts
└── DistributionChart

src/features/admin/statistics/components/MonthlyCharts.jsx
├── MonthlyCharts
└── MonthlyChart

src/features/admin/statistics/components/StatisticsSummary.jsx
├── StatisticsSummary
└── Metric

src/features/admin/statistics/components/KpiGrid.jsx
└── KpiGrid

src/features/admin/statistics/components/TopOpportunitiesChart.jsx
└── TopOpportunitiesChart

src/features/admin/statistics/components/StatsUi.jsx
├── SectionCard
├── Skeleton
├── EmptyState
└── ChartTooltip
```

### Calendar, gallery, home, and registrations

```text
src/features/calendar/components/EventsCalendar.jsx
└── EventsCalendar
    └── shiftMonth

src/features/calendar/components/CalendarGrid.jsx
├── CalendarGrid
└── NavButton

src/features/calendar/components/CalendarDayPanel.jsx
└── CalendarDayPanel

src/features/calendar/components/CalendarEmptyState.jsx
└── CalendarEmptyState

src/features/gallery/pages/GalleryPage.jsx
├── GalleryPage
└── GalleryItem

src/features/home/pages/HomePage.jsx
└── HomePage

src/features/registrations/pages/MyRegistrationsPage.jsx
├── formatDate
└── MyRegistrationsPage
    └── handleCancel
```

### Shared UI components

```text
src/shared/components/Navbar.jsx
└── Navbar
    ├── onScroll
    ├── handleClick
    └── NavBtn

src/shared/components/DateInputIL.jsx
└── DateInputIL
    └── apply

src/shared/components/ConfirmModal.jsx
└── ConfirmModal

src/shared/components/Toast.jsx
└── Toast
```

---

## Frontend Utility Functions

```text
src/utils/calendar.js
├── getMonthGrid
├── dateKey
└── buildRegisteredCalendarEntries

src/utils/israeliDate.js
├── isoToDisplay
├── displayToIso
├── maskIsraeliDateInput
└── formatIsraeliDate

src/utils/opportunitySchedule.js
├── timeParts
└── getOpportunityDisplaySchedule

src/utils/permissions.js
├── canManageOpportunity
├── isStaffRole
└── filterManageable

src/utils/scheduleEvents.js
├── parseWeekdays
├── parseStartTime
├── dateKeyLocal
├── parseDateOnly
└── buildCalendarEvents

src/utils/storage.js
├── load
├── save
├── loadSession
├── saveSession
├── loadTheme
├── saveTheme
├── loadCurrentScreen
└── saveCurrentScreen

src/data/organizations.js
├── getCityName
└── getOrgName

src/data/opportunityOptions.js
├── getStatusLabelKey
└── getTypeLabelKey

src/i18n/i18n.js
├── useT
└── setDocumentLang
```

---

## Backend Request Pipeline

```text
HTTP request
├── connectDb middleware
├── optionalAuth
│   ├── verifyToken
│   └── userRepository.findSafeById
├── requireAuth / requireRoles / requireSelfOrRoles
├── Route
├── Controller
├── Service
├── Repository
└── MongoDB
```

### Authentication endpoints

```text
POST /api/auth/login
└── authController.login
    └── authService.login
        ├── userRepository.findByCredentials
        ├── entities.toSafeUser
        └── tokenService.issueToken
            ├── signature
            └── secret

POST /api/auth/register
└── authController.register
    └── authService.register
        ├── userRepository.findByUsername
        ├── userRepository.getNextUserId
        ├── entities.createUser
        ├── userRepository.insert
        └── entities.toSafeUser
```

### Bootstrap endpoint

```text
GET /api/bootstrap
└── bootstrapController.bootstrap
    └── bootstrapService.getBootstrapData
        └── bootstrapRepository.loadBootstrapData
```

### Opportunity endpoints

```text
POST /api/opportunities
└── opportunityController.createOpportunity
    └── opportunityService.addOpportunity
        ├── validateOpportunity
        ├── assertCanManageOrganization
        ├── counterRepository.nextId
        ├── entities.createOpportunity
        └── opportunityRepository.insert

PUT /api/opportunities/:id
└── opportunityController.updateOpportunity
    └── opportunityService.updateOpportunity
        ├── assertValidId
        ├── opportunityRepository.findById
        ├── validateOpportunity
        ├── assertCanManageOrganization
        ├── entities.createOpportunity
        └── opportunityRepository.replaceById

DELETE /api/opportunities/:id
└── opportunityController.deleteOpportunity
    └── opportunityService.deleteOpportunity
        ├── assertValidId
        ├── opportunityRepository.findById
        ├── assertCanManageOrganization
        ├── opportunityRepository.deleteById
        ├── eventRepository.deleteByOpportunityId
        ├── registrationRepository.deleteByOpportunityId
        └── viewRepository.deleteByOpportunityId
```

### Event endpoints

```text
POST /api/events
└── eventController.createEvent
    └── eventService.addEvent
        ├── requireManageableOpportunity
        ├── counterRepository.nextId
        ├── entities.createEvent
        └── eventRepository.insert

DELETE /api/events/:id
└── eventController.deleteEvent
    └── eventService.deleteEvent
        ├── assertValidId
        ├── eventRepository.findById
        ├── requireManageableOpportunity
        └── eventRepository.deleteById

PUT /api/events/by-opportunity/:opportunityId
└── eventController.replaceOpportunityEvents
    └── eventService.replaceOpportunityEvents
        ├── assertValidId
        ├── requireManageableOpportunity
        ├── eventRepository.deleteByOpportunityId
        ├── counterRepository.nextId
        ├── entities.createEvent
        └── eventRepository.insert
```

### Registration endpoints

```text
POST /api/registrations
└── registrationController.register
    └── registrationService.register
        ├── assertIds
        ├── opportunityRepository.findById
        ├── registrationRepository.find
        ├── counterRepository.nextId
        ├── entities.createRegistration
        ├── registrationRepository.insert
        ├── profileRepository.findByUserId
        └── profileRepository.upsert

DELETE /api/registrations
└── registrationController.unregister
    └── registrationService.unregister
        ├── assertIds
        ├── registrationRepository.remove
        ├── counterRepository.nextId
        ├── entities.createCancellation
        └── registrationRepository.insertCancellation
```

### User endpoints

```text
GET /api/users
└── userController.listUsers
    └── userService.listUsers
        └── userRepository.findAll

POST /api/users
└── userController.createUser
    └── userService.createUserAccount
        ├── validateAccountFields
        ├── userRepository.findByUsername
        ├── userRepository.getNextUserId
        ├── entities.createUser
        ├── userRepository.insert
        └── entities.toSafeUser

PUT /api/users/:id
└── userController.updateUser
    └── userService.updateUserAccount
        ├── assertValidId
        ├── validateAccountFields
        ├── userRepository.findUsernameConflict
        ├── entities.createUserPatch
        ├── userRepository.updateById
        └── userRepository.findSafeById

DELETE /api/users/:id
└── userController.deleteUser
    └── userService.deleteUserAccount
        ├── assertValidId
        ├── userRepository.deleteById
        └── userRepository.deleteRelatedData
```

### Views, profiles, organizations, statistics, and health

```text
POST /api/views
└── viewController.createView
    └── viewService.recordView
        ├── opportunityRepository.findById
        ├── viewRepository.find
        ├── entities.createView
        └── viewRepository.insert

GET /api/profiles/:userId
└── profileController.showProfile
    └── profileService.getProfile
        └── profileRepository.findByUserId

GET /api/organizations
└── organizationController.list
    └── organizationService.listOrganizations
        └── organizationRepository.findAll

GET /api/stats
└── statsController.showStats
    └── statsService.getStatistics
        ├── statsRepository.loadStatsData
        └── fillMonths

GET /api/health
└── healthController.health
```

---

## Backend Functions by Layer

### Database and middleware

```text
server/src/db.js
├── _connect
├── connectDb
├── getDb
└── closeDb

server/src/middleware/auth.js
├── optionalAuth
├── requireAuth
├── requireRoles
└── requireSelfOrRoles

server/src/middleware/asyncHandler.js
└── asyncHandler

server/src/middleware/connectDb.js
└── default database-connection middleware

server/src/services/tokenService.js
├── secret
├── signature
├── issueToken
└── verifyToken

server/src/utils/AppError.js
└── AppError.constructor
```

### Controllers

```text
authController
├── login
└── register

bootstrapController
└── bootstrap

eventController
├── createEvent
├── deleteEvent
└── replaceOpportunityEvents

healthController
└── health

opportunityController
├── createOpportunity
├── updateOpportunity
└── deleteOpportunity

organizationController
└── list

profileController
└── showProfile

registrationController
├── register
└── unregister

statsController
└── showStats

userController
├── listUsers
├── createUser
├── updateUser
└── deleteUser

viewController
└── createView
```

### Services

```text
authService
├── login
└── register

bootstrapService
└── getBootstrapData

eventService
├── addEvent
├── deleteEvent
├── replaceOpportunityEvents
├── assertValidId
└── requireManageableOpportunity

opportunityService
├── addOpportunity
├── updateOpportunity
├── deleteOpportunity
├── assertValidId
├── validateOpportunity
└── assertCanManageOrganization

organizationService
└── listOrganizations

profileService
└── getProfile

registrationService
├── register
├── unregister
└── assertIds

statsService
├── getStatistics
└── fillMonths

tokenService
├── secret
├── signature
├── issueToken
└── verifyToken

userService
├── listUsers
├── createUserAccount
├── updateUserAccount
├── deleteUserAccount
├── assertValidId
└── validateAccountFields

viewService
└── recordView
```

### Models

```text
server/src/models/entities.js
├── toSafeUser
├── createUser
├── createUserPatch
├── createOpportunity
├── createEvent
├── createRegistration
├── createCancellation
├── createView
└── withoutMongoMetadata
```

### Repositories

```text
bootstrapRepository
└── loadBootstrapData

counterRepository
├── nextId
└── nextIdAtLeast

eventRepository
├── events
├── findById
├── insert
├── deleteById
└── deleteByOpportunityId

opportunityRepository
├── opportunities
├── findById
├── insert
├── replaceById
└── deleteById

organizationRepository
└── findAll

profileRepository
├── profiles
├── findByUserId
└── upsert

registrationRepository
├── registrations
├── cancellations
├── find
├── insert
├── remove
├── insertCancellation
└── deleteByOpportunityId

statsRepository
├── loadStatsData
└── aggregateMonthly

userRepository
├── users
├── findByCredentials
├── findByUsername
├── findUsernameConflict
├── getNextUserId
├── findAll
├── insert
├── updateById
├── findSafeById
├── deleteById
└── deleteRelatedData

viewRepository
├── views
├── find
├── insert
└── deleteByOpportunityId
```

Repository helpers such as `users`, `events`, `profiles`, `registrations`, `cancellations`, `opportunities`, and `views` return their corresponding MongoDB collections. They are included because they are named functions, even though they are internal rather than exported API operations.
