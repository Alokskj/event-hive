# EventHive 🎟️

**EventHive** is a comprehensive event management platform where organizers can create, publish, and manage events with flexible ticketing and promotions, while attendees can discover, register, pay, and receive tickets via Email/WhatsApp — with timely reminders and smooth check-in experiences.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Features](#features)
* [User Roles](#user-roles)
* [Tech Stack](#tech-stack)
* [Prerequisites](#prerequisites)
* [Quick Start (Local Development)](#quick-start-local-development)
* [Environment Variables (.env.example)](#environment-variables-envexample)
* [Database & Migrations](#database--migrations)
* [Running with Docker (optional)](#running-with-docker-optional)
* [Testing](#testing)
* [API Documentation](#api-documentation)
* [Deployment](#deployment)
* [CI / CD](#ci--cd)
* [Contributing](#contributing)
* [Code Style & Linting](#code-style--linting)
* [Security & Privacy Notes](#security--privacy-notes)
* [License](#license)
* [Contact](#contact)

---

## Project Overview

EventHive helps event organizers manage the full lifecycle of events (creation → ticketing → check-in → analytics), and lets attendees discover and join events seamlessly. The platform supports multiple ticket types, integrated payments, QR/Barcode ticketing, automated reminders, and dashboards for organizers and attendees.

## Features

1. **Event Creation & Publishing**

   * Create events with title, description, date, time, location, category.
   * Add ticket types (General, VIP, Student, Early Bird).
   * Set ticket price, sale window, and max quantity.
   * Save as draft or publish publicly.
2. **Event Discovery & Search**

   * Browse/search by category, date, location, and price.
   * Filters: sport type, venue type, rating, trending, pagination.
   * Featured/Trending section.
3. **Registration & Booking**

   * Select ticket type, book multiple tickets (with per-user limits).
   * Secure registration (name, email, phone).
   * Integrated payments (UPI, cards, netbanking, wallets).
   * Transaction confirmation with unique booking ID.
4. **Ticket Delivery**

   * Auto-generated ticket (QR/Barcode).
   * Delivery via Email (PDF) or WhatsApp (link).
   * Download ticket from user dashboard.
5. **Notifications & Reminders**

   * Booking confirmation via Email/WhatsApp.
   * Automated reminders: 24 hours and 1 hour before event.
   * SMS / Push notification integration (optional).
6. **Organizer Dashboard**

   * Manage events, inventory, bookings.
   * Real-time sales analytics and revenue tracking.
   * Export attendee lists as CSV/Excel.
   * Role-based access (Admin, Event Manager, Volunteer).
7. **Attendee Dashboard**

   * View "My Tickets" and booking history.
   * Cancel bookings (with refund workflow).
   * Loyalty points & rewards.
8. **Discounts & Promotions**

   * Promo codes and coupons, early-bird discounts, group offers, referrals.
9. **Event Check-In System**

   * QR/Barcode scanning, real-time validation, duplicate-prevention.
10. **Analytics & Reports**

* Tickets sold, revenue, active attendees, demographic insights, downloadable reports.

11. **Advanced**

* Refund & cancellation workflow, social sharing, live streaming for hybrid events, map view for events.

---

## User Roles

### **Attendee (User)**

* Discover events via search, filters, and map view.
* Register and book tickets securely.
* Receive tickets via Email/WhatsApp and download from dashboard.
* Manage bookings: view, cancel, and claim refunds as per policies.
* Earn loyalty points and referral rewards.
* Receive notifications, reminders, and event updates.

### **Organizer (Admin/Event Manager)**

* Create, edit, and publish events.
* Manage ticket inventory, pricing, discounts, and promotional codes.
* Track bookings and revenue in real time.
* Export attendee lists and check-in reports.
* Manage roles (Admin, Event Manager, Volunteer).
* Monitor check-ins using QR/Barcode scanners.
* Generate analytics reports and insights.
* Handle refund workflows and attendee communication.

---

## Tech Stack (suggested)

* **Backend**: Node.js (TypeScript), Express / NestJS
* **Database**: PostgreSQL
* **ORM**: Prisma
* **Auth**: JWT + Refresh tokens (or OAuth providers)
* **Payments**: Razorpay / Stripe / PayU (UPI + Cards + Wallets)
* **Queue / Jobs**: Redis + Bull / RabbitMQ (reminders, emails, WhatsApp sending)
* **File / Media**: AWS S3 / Google Cloud Storage
* **Email**: SendGrid / Amazon SES
* **WhatsApp**: Twilio API for WhatsApp or WhatsApp Business API provider
* **Frontend**: React (Next.js recommended)
* **Mobile (optional)**: React Native / Flutter
* **Check-in**: Mobile/web scanner with camera or Bluetooth scanner support
* **Containerization**: Docker
* **CI**: GitHub Actions

> These are suggestions — replace with your preferred stack if needed.

---

## Prerequisites

* Node.js >= 18
* npm or yarn
* PostgreSQL (local or managed)
* Redis (for job queues)
* Docker (optional but recommended for parity)
* Prisma CLI (`npm install -g prisma` optional)

---

## Quick Start (Local Development)

> Example assumes `backend/` and `frontend/` monorepo layout. Adjust folders to your repo structure.

1. **Clone the repo**

```bash
git clone https://github.com/<your-org>/eventhive.git
cd eventhive
```

2. **Copy environment files**

```bash
cp .env.example .env
# edit .env and add DB credentials, API keys, and other secrets
```

3. **Install dependencies**

```bash
# Backend
cd backend
npm install

# Frontend (in a separate terminal)
cd ../frontend
npm install
```

4. **Database setup & migrations**

```bash
# from backend/
npx prisma migrate dev --name init
npx prisma db seed # if seed script present
```

5. **Run services**

```bash
# start backend
cd backend
npm run dev

# start frontend
cd ../frontend
npm run dev
```

6. **Access app**

* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:4000` (or the port set in .env)

---

## Environment Variables (.env.example)

```env
# App
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# Prisma
PRISMA_CLIENT_ENGINE_TYPE=binary

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Payments
PAYMENT_PROVIDER=razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
STRIPE_SECRET_KEY=

# Email & WhatsApp
SENDGRID_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Storage
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Redis (for queue)
REDIS_URL=redis://localhost:6379

# Other
FRONTEND_URL=http://localhost:3000
```

---

## Database & Migrations

We recommend using Prisma with PostgreSQL.

* Define your schema in `backend/prisma/schema.prisma`.
* Run migrations with `npx prisma migrate dev` during development.
* Use `npx prisma db pull` to introspect an existing database.
* Use `npx prisma studio` to visually inspect DB data locally.

**Seeding**: provide seed scripts at `backend/prisma/seed.ts` or `scripts/seed.js`.

---

## Running with Docker (optional)

A Docker Compose setup can include services: `backend`, `frontend`, `postgres`, `redis`.

Example `docker-compose.yml` steps:

1. Copy `.env.example` -> `.env` and update DB host to `postgres`.
2. `docker compose up --build`

Make sure to configure `DATABASE_URL` to use `postgres://user:pass@postgres:5432/dbname` in `.env` used by containers.

---

## Testing

* Unit tests: jest (backend), react-testing-library (frontend)
* Run backend tests: `npm run test` (from `backend/`)
* Run frontend tests: `npm run test` (from `frontend/`)

Set up CI to run tests on every PR.

---

## API Documentation

* Keep OpenAPI / Swagger spec in `backend/docs/openapi.yaml` or generate from code.
* Serve a docs UI at `/docs` (Swagger UI).
* Document authentication flows, errors, and request/response shapes.

---

## Deployment

* Build artifacts for frontend (Next.js) and backend.
* Use managed Postgres (e.g., AWS RDS), managed Redis (Elasticache), and S3 for assets.
* Configure environment variables securely in your hosting provider (Vercel, AWS, DigitalOcean App Platform, Heroku, etc.).
* Run Prisma migrations during deploy: `npx prisma migrate deploy`.

---

## CI / CD

Example: GitHub Actions

* Lint & typecheck
* Run tests
* Build and push Docker images (if using Docker)
* Deploy to staging and production on merge to main with required approvals

---

## Contributing

Thanks for wanting to contribute! Basic workflow:

1. Fork the repo and create a feature branch: `git checkout -b feat/your-feature`
2. Implement changes and write tests
3. Run linters and tests
4. Open a PR against `main` and request reviewers

Please follow these guidelines in PRs:

* Include a short description of changes and rationale
* Reference relevant issues
* Keep changes small and focused

---

## Code Style & Linting

* Backend: ESLint + Prettier + TypeScript
* Frontend: ESLint + Prettier + React Hooks rules
* Commit messages: Conventional Commits recommended

---

## Security & Privacy Notes

* Never commit `.env` or secrets to source control. Add them to `.gitignore`.
* Use encryption and secure storage for keys (Secrets Manager, GitHub Secrets).
* Follow PCI/DSS requirements when handling payment data — prefer tokenized payments from providers.
* Validate user inputs and ensure rate-limiting on public endpoints.

---

## Useful Development Tips

* Use feature flags for experimental features.
* Use background workers for heavy tasks (email sending, ticket generation).
* Cache frequently used discovery endpoints (e.g., events list) with short TTLs.

---

## License

Specify your license here (MIT, Apache-2.0, etc.).

---

## Contact

Project maintainers / org: `<your-org-or-email>`

---

> *This README is a template. Edit sections and commands to match your repository layout and chosen stack.*
