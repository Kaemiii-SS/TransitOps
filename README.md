# TransitOps — Fleet Management Backend

A RESTful backend for managing a vehicle fleet's full operational lifecycle — vehicles, drivers, trips, maintenance, fuel & expenses, and analytics — built for an 8-hour hackathon with an emphasis on clean database design and role-based access control.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [Roles & Permissions](#roles--permissions)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Known Constraints](#known-constraints)

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js (ESM modules) |
| Framework | Express |
| ORM | Prisma (locked to v6.x) |
| Database | PostgreSQL, hosted on [Neon](https://neon.tech) |
| Auth | JWT, delivered via httpOnly cookie |
| Password hashing | bcryptjs |

> **Note on Prisma version:** this project is intentionally pinned to Prisma 6.x. Prisma 7 requires a `prisma.config.ts`/`.js` file and has an open bug where `require("prisma/config")` fails with "Cannot find module" in plain JavaScript (non-TypeScript) setups. Do not upgrade without resolving that first.

## Features

- **Auth** — signup, login, logout, session check, JWT-in-cookie, role-based middleware
- **Vehicle Registry** — full CRUD, filtering by type/status/region, available-vehicles lookup, derived operational cost per vehicle
- **Driver Management** — full CRUD, filtering by status/license category, available-drivers lookup
- **Trip Lifecycle** — draft → dispatch → complete/cancel, with atomic vehicle+driver status transitions and dispatch-time validation (cargo capacity, availability, license expiry, suspension)
- **Maintenance Logs** — opening/closing records tied directly to vehicle status (`IN_SHOP` ↔ `AVAILABLE`)
- **Fuel & Expense Logging** — per-vehicle records, optionally linked to a trip
- **Analytics** — fleet utilization %, per-vehicle fuel efficiency (km/liter), per-vehicle ROI, CSV export of the full fleet report
- **Dashboard KPIs** — single-call summary of active/available vehicles, vehicles in maintenance, active/pending trips, drivers on duty, and fleet utilization

## Project Structure

```
Backend/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   └── db.js                    # Prisma client singleton
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── vehicle.controller.js
│   │   ├── driver.controller.js
│   │   ├── trip.controller.js
│   │   ├── maintenance.controller.js
│   │   ├── fuel.controller.js
│   │   ├── expense.controller.js
│   │   ├── cost.controller.js
│   │   ├── analytics.controller.js
│   │   └── dashboard.controller.js
│   ├── routes/
│   │   └── ... one router per resource, mirroring controllers/
│   ├── middlewares/
│   │   ├── auth.middleware.js       # verifyJWT
│   │   ├── role.middleware.js       # authorizeRoles(...)
│   │   └── error.middleware.js      # centralized error handler
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── generateToken.js
│   ├── app.js                       # Express app, middleware, route mounts
│   └── server.js                    # entry point
├── .env
├── .gitignore
└── package.json
```

## Data Model

Six core entities, related as follows:

- **User** — authenticates and holds a `role` (`FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`)
- **Vehicle** — has many Trips, MaintenanceLogs, FuelLogs, Expenses
- **Driver** — has many Trips
- **Trip** — belongs to one Vehicle and one Driver; has many FuelLogs, Expenses
- **MaintenanceLog** — belongs to a Vehicle
- **FuelLog** — belongs to a Vehicle, optionally a Trip
- **Expense** — belongs to a Vehicle, optionally a Trip

Key enums:

```
VehicleStatus:      AVAILABLE | ON_TRIP | IN_SHOP | RETIRED
DriverStatus:        AVAILABLE | ON_TRIP | OFF_DUTY | SUSPENDED
TripStatus:          DRAFT | DISPATCHED | COMPLETED | CANCELLED
MaintenanceStatus:    ACTIVE | CLOSED
ExpenseType:          TOLL | MAINTENANCE | OTHER
```

Full schema lives in `prisma/schema.prisma` — treat it as source of truth; don't regenerate or re-migrate without coordinating on the schema changes first.

## Roles & Permissions

Access is enforced entirely in middleware (`authorizeRoles(...)`), not in the database.

| Role | Vehicles | Drivers | Trips | Fuel/Expenses | Analytics | Dashboard |
|---|---|---|---|---|---|---|
| **FLEET_MANAGER** | full | full | – | – | full | full |
| **DISPATCHER** | view | – | full | – | – | full |
| **SAFETY_OFFICER** | – | full | view | – | view | full |
| **FINANCIAL_ANALYST** | view | – | – | full | full | full |

`–` means the role has no access to that resource at all — every route under it returns `403 Forbidden` for that role. Dashboard is open to all authenticated roles.

## Getting Started

```bash
# install dependencies
npm install

# set up environment variables (see below)
cp .env.example .env

# run database migrations against your Neon instance
npx prisma migrate deploy

# start the server
npm run dev
```

Server runs on `http://localhost:3000` by default.

## Environment Variables

```env
DATABASE_URL=postgresql://<user>:<password>@<neon-host>/<dbname>?sslmode=require&channel_binding=require
JWT_SECRET=<long random string>
JWT_EXPIRY=7d
PORT=3000
```

All four are required — a missing `JWT_EXPIRY` in particular will cause `jwt.sign()` to throw at runtime.

## API Reference

Base URL: `/api/v1`. Every response follows:

```json
{ "statusCode": 200, "data": { ... }, "message": "...", "success": true }
```

### Auth — `/auth`
| Method | Path | Body |
|---|---|---|
| POST | `/signup` | `{ email, password, role }` |
| POST | `/login` | `{ email, password }` |
| POST | `/logout` | — |
| GET | `/me` | — |

### Vehicles — `/vehicles`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | query: `type`, `status`, `region` |
| GET | `/available` | only `AVAILABLE` vehicles |
| GET | `/:id` | |
| POST | `/` | `{ registrationNumber, nameModel, type, maxLoadCapacity, odometer?, acquisitionCost, region? }` |
| PATCH | `/:id` | partial update |
| DELETE | `/:id` | |
| GET | `/:id/cost` | derived operational cost breakdown |

### Drivers — `/drivers`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | query: `status`, `licenseCategory` |
| GET | `/available` | only `AVAILABLE` drivers |
| GET | `/:id` | |
| POST | `/` | `{ name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore? }` |
| PATCH | `/:id` | partial update, including `status` |
| DELETE | `/:id` | |

### Trips — `/trips`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | query: `status`; returns nested vehicle/driver |
| GET | `/:id` | |
| POST | `/` | `{ source, destination, vehicleId, driverId, cargoWeight, plannedDistance }` — creates as `DRAFT` |
| PATCH | `/:id/dispatch` | validates capacity, availability, license, suspension |
| PATCH | `/:id/complete` | `{ actualDistance?, fuelConsumed?, revenue? }` |
| PATCH | `/:id/cancel` | from `DRAFT` or `DISPATCHED` |

### Maintenance — `/maintenance`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | query: `status`, `vehicleId` |
| GET | `/:id` | |
| POST | `/` | `{ vehicleId, description, cost }` — vehicle → `IN_SHOP` |
| PATCH | `/:id/close` | vehicle → `AVAILABLE` (or stays `RETIRED`) |

### Fuel Logs — `/fuel-logs`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | query: `vehicleId`, `tripId` |
| GET | `/:id` | |
| POST | `/` | `{ vehicleId, tripId?, liters, cost, date }` |
| DELETE | `/:id` | |

### Expenses — `/expenses`
| Method | Path | Notes |
|---|---|---|
| GET | `/` | query: `vehicleId`, `tripId`, `type` |
| GET | `/:id` | |
| POST | `/` | `{ vehicleId, tripId?, type, amount, date, notes? }` |
| DELETE | `/:id` | |

### Analytics — `/analytics`
| Method | Path | Notes |
|---|---|---|
| GET | `/fleet-utilization` | % of non-`RETIRED` vehicles currently `ON_TRIP` |
| GET | `/vehicles/:id/fuel-efficiency` | km/liter from completed trips + fuel logs |
| GET | `/vehicles/:id/roi` | `((revenue − cost) / cost) × 100` |
| GET | `/export/csv` | raw CSV, not JSON |

### Dashboard — `/dashboard`
| Method | Path | Notes |
|---|---|---|
| GET | `/kpis` | query: `type`, `status`, `region` (affect vehicle-based KPIs only) |

## Authentication

JWTs are issued on signup/login and set as an **httpOnly cookie** — not returned in the response body, and never sent via an `Authorization` header. Consequences for API consumers:

- Requests must be made with credentials included (`credentials: "include"` for `fetch`, `withCredentials: true` for axios), or the cookie won't be sent.
- CORS is configured with `credentials: true` and a specific `origin` (not `*`) to support this — the frontend origin must match `CORS_ORIGIN` in `.env`.
- There is no token to store client-side; the browser handles it automatically via the cookie.

## Known Constraints

- Prisma is pinned to v6.x — see the Tech Stack note above before considering an upgrade.
- Route paths are plural (`/vehicles`, `/drivers`, `/trips`) — a singular path returns a 404, not a 400, which can look like a missing endpoint rather than a typo.
- `prisma/migrations/` must be committed to version control — it is not safe to `.gitignore`, since a missing migrations folder causes "drift detected" errors on a fresh clone or machine.
- CSV export (`/analytics/export/csv`) returns `Content-Type: text/csv`, not the standard JSON envelope — handle it as a file download on the frontend, not a parsed response.
- PDF export was scoped out of this project; CSV is the only export format.

  ### Deployed Link of the website
https://transit-ops-henna.vercel.app/
