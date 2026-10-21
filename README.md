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
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB instance (replica set required for transactions, e.g. MongoDB Atlas or local replica set)

### 1. Server Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT secrets
npm install
npm run dev
```

Server health check: `http://localhost:5000/api/health`

### 2. Client Setup
```bash
cd client
npm install
npm run dev
```

Client web application: `http://localhost:5173`

---

## Documentation Links

- [AGENT Rules & Commands](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/AGENT.md)
- [System Architecture](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/ARCHITECTURE.md)
- [Security Governance](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/SECURITY.md)
- [Database Data Dictionary](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/DATABASE.md)
- [API Reference](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/API.md)
- [Implementation Progress](file:///c:/Users/harsh/OneDrive/Desktop/crowd-report/docs/IMPLEMENTATION_STATUS.md)
