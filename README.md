# Crowd Report Platform

A full-stack civic issue reporting and resolution platform built on the MERN stack (MongoDB Atlas / Replica Set, Express.js, React + Vite + Tailwind CSS, Node.js). Citizens report local issues (road damage, drainage, streetlights, garbage, water supply), get transparent fee quotes, pay a 50% advance, and track progress until an assigned local resolver fixes the issue with verifiable photo proof.

---

## Architecture Overview

- **Server**: Node.js + Express (ES Modules) with layered separation: Routes -> Middleware -> Controllers -> Services -> Models.
- **Client**: React 18, Vite, React Router v6, Tailwind CSS, TanStack Query, Axios (`withCredentials: true`), Leaflet.
- **Database**: MongoDB with Replica Set enabled for multi-document ACID transactions.
- **Security**: Double-token cookie authentication (`httpOnly`, `Secure`, `SameSite: 'lax'`), CSRF double-submit token validation, strict rate limiting, Helmet, NoSQL injection sanitization.
- **Accounting**: Strict integer paise accounting (1 INR = 100 paise; no floating-point currency calculations).
- **AI Integration**: Google Gemini Flash-Lite with PII scrubbing, strict structured outputs, and automated deterministic fallback.

---

## Project Structure

```text
crowd-report/
├── AGENT.md                      # AI agent and development operating rules
├── docs/                         # Architecture, Security, Database, API, and Module specifications
│   ├── ARCHITECTURE.md
│   ├── SECURITY.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── UI_GUIDE.md
│   ├── AI.md
│   ├── FINANCE.md
│   ├── NOTIFICATIONS.md
│   ├── TESTING.md
│   ├── DECISIONS.md
│   ├── ENVIRONMENT.md
│   ├── IMPLEMENTATION_STATUS.md
│   └── modules/                  # M0 to M13 module specifications
├── server/                       # Express backend
└── client/                       # Vite React frontend
```

---

## Quick Start (Development)

### Prerequisites
- Node.js (v18.0.0 or higher; v20+ recommended)
- npm (v9.0.0 or higher)
- MongoDB instance (MongoDB Community / Atlas / Replica Set for multi-document ACID transactions)

### 1. Server Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT secrets
npm install

# Seed Initial Administrator Account
npm run seed:admin
# Output: Administrator initialized (admin@crowdreport.local / Admin@123456)

# Seed Default Civic Categories & Fee Parameters
npm run seed:defaults
# Output: Populates Drainage, Road Damage, Streetlight, Garbage, Water Supply + FeeSettings singleton

# Start Express Backend (Runs on http://localhost:5000)
npm run dev
```

Server health check: `http://localhost:5000/api/health`

### 2. Client Setup
```bash
cd client
cp .env.example .env
npm install

# Start Vite Development Server (Runs on http://localhost:5173)
npm run dev
```

Client web application: `http://localhost:5173`

---

## Testing & Quality Assurance

### Automated Backend Test Suites (Vitest)
```bash
cd server

# Run all 6 unit & integration test suites (38 assertions)
npm test

# Run RBAC security permission matrix across all 5 roles
npm run test:security

# Run vulnerability security audit
npm run audit
```

Test Suites Included:
1. `tests/auth.test.js`: Double-cookie session security, account lockout (5 failed attempts), token rotation, CSRF protection.
2. `tests/feeMath.test.js`: Mathematical verification of 5 worked numeric test vectors, integer paise rounding, and clamp limits.
3. `tests/concurrentAssign.test.js`: Dual-admin simultaneous task assignment race condition simulation.
4. `tests/paymentIdempotency.test.js`: Concurrent payment replay simulation asserting zero duplicate transactions or invoices.
5. `tests/aiSecurity.test.js`: Adversarial prompt injection defense, PII sanitization, and deterministic circuit breaker fallback.
6. `tests/rbac.test.js`: Full permission matrix asserting 401/403 across public, citizen, resolver, and administrator endpoints.

### Frontend Production Validation
```bash
cd client
npm run build
```
Executes TypeScript typechecking (`tsc -b`) and production bundle compilation with zero errors.

---

## Automated Maintenance Scripts

```bash
cd server

# 1. Expire abandoned quotes awaiting 50% advance for > 24 hours
node scripts/expireAwaitingAdvance.js --dry-run
node scripts/expireAwaitingAdvance.js # Live execution

# 2. Audit and prune unreferenced / orphan Cloudinary image assets
node scripts/cleanupOrphanImages.js --dry-run
node scripts/cleanupOrphanImages.js --delete # Deletes confirmed orphans
```

---

## Demonstration Credentials

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@crowdreport.local` | `Admin@123456` | Operations management, resolver approvals, task assignment, finance & ledger |
| **Citizen** | Register at `/register` | Self-chosen | Issue reporting, tracking, advance & balance payment, feedback |
| **Resolver** | Register at `/register-resolver` | Self-chosen | Contractor application, task execution, before/after resolution photo proof |

---

## Documentation Links

- [AGENT Rules & Commands](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/AGENT.md)
- [System Architecture](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/ARCHITECTURE.md)
- [Security Governance](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/SECURITY.md)
- [Database Data Dictionary](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/DATABASE.md)
- [API Reference](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/API.md)
- [Financial Formulas & Test Vectors](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/FINANCE.md)
- [Testing & Quality Assurance Guide](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/TESTING.md)
- [Implementation Progress](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/IMPLEMENTATION_STATUS.md)

