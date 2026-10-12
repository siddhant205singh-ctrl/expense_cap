# ExpenseCap 💰

> **Cap your chaos. Grow your wealth.**

A 100% free, open-source personal finance tracker. Track expenses across multiple wallets, set budgets, manage savings goals, loans, and fixed costs — all in one place. No ads, no premium tier, no credit card required.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+ (local or Atlas)
- npm 9+

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/expensecap.git
cd expensecap
npm run install:all
```

### 2. Configure Environment Variables

**Backend:**
```bash
cp backend/.env.example backend/.env
```
Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/expensecap
JWT_ACCESS_SECRET=your_super_secret_access_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env
```
Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Seed Demo Data (Optional)
```bash
npm run seed
```
Demo credentials: `demo@expensecap.io` / `Demo@1234`

### 4. Run Development Servers
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for all packages |
| `npm run dev` | Run both servers concurrently |
| `npm run dev:backend` | Run backend only |
| `npm run dev:frontend` | Run frontend only |
| `npm run build:frontend` | Build frontend for production |
| `npm run seed` | Seed database with demo data |

**Backend only:**
```bash
cd backend
npm run dev    # nodemon
npm start      # production
npm run seed   # seed demo data
```

**Frontend only:**
```bash
cd frontend
npm run dev    # vite dev server
npm run build  # production build
npm run preview # preview production build
```

---

## 🏗️ Architecture

```
expensecap/
├── README.md
├── .gitignore
├── package.json          # Root helper scripts
│
├── frontend/             # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/          # Axios API modules
│   │   ├── components/   # UI, landing, dashboard, charts
│   │   ├── context/      # Auth, Theme context
│   │   ├── hooks/        # Custom React hooks
│   │   ├── layouts/      # PublicLayout, AppLayout
│   │   ├── pages/        # All page components
│   │   ├── routes/       # ProtectedRoute
│   │   └── utils/        # formatCurrency, dates, constants
│   └── public/           # PWA assets, icons
│
└── backend/              # Node.js + Express API
    └── src/
        ├── config/       # DB connection, env config
        ├── controllers/  # Business logic
        ├── middleware/   # Auth, validate, errors
        ├── models/       # Mongoose schemas
        ├── routes/       # Express routers
        ├── utils/        # Helpers, ApiError
        ├── validators/   # Zod schemas
        └── seed/         # Demo data seeder
```

---

## 🔌 API Overview

**Base URL:** `http://localhost:5000/api/v1`

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

All responses follow the envelope:
```json
{ "success": true, "data": { ... } }
{ "success": false, "error": { "message": "..." } }
```

**Money is stored as integers** (smallest currency unit). `$10.50 = 1050`.

### Auth `/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user (seeds default categories) |
| POST | `/auth/login` | Login, returns access token + refresh cookie |
| POST | `/auth/logout` | Clears refresh cookie |
| POST | `/auth/refresh` | Refresh access token from cookie |
| GET | `/auth/me` | Get current user |
| PATCH | `/auth/change-password` | Change password |

### Wallets `/wallets`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallets` | List all wallets |
| POST | `/wallets` | Create wallet |
| GET | `/wallets/:id` | Get single wallet |
| PATCH | `/wallets/:id` | Update wallet |
| DELETE | `/wallets/:id` | Archive wallet |
| POST | `/wallets/transfer` | Transfer between wallets |

### Transactions `/transactions`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | List (filters: type, category, wallet, dateFrom, dateTo, search, page, limit) |
| POST | `/transactions` | Create transaction |
| GET | `/transactions/:id` | Get single transaction |
| PATCH | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

### Categories `/categories`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/categories` | List (user + system) |
| POST | `/categories` | Create custom category |
| PATCH | `/categories/:id` | Update category |
| DELETE | `/categories/:id` | Delete category |

### Budgets `/budgets`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budgets?month=YYYY-MM` | List budgets with spent amount |
| POST | `/budgets` | Create budget |
| PATCH | `/budgets/:id` | Update budget |
| DELETE | `/budgets/:id` | Delete budget |

### Goals `/goals`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/goals` | List all goals |
| POST | `/goals` | Create goal |
| GET | `/goals/:id` | Get goal with contributions |
| PATCH | `/goals/:id` | Update goal |
| DELETE | `/goals/:id` | Delete goal |
| POST | `/goals/:id/contributions` | Add contribution |
| DELETE | `/goals/:id/contributions/:cid` | Remove contribution |

### Loans `/loans`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/loans` | List all loans |
| POST | `/loans` | Create loan |
| GET | `/loans/:id` | Get loan with repayments |
| PATCH | `/loans/:id` | Update loan |
| DELETE | `/loans/:id` | Delete loan |
| POST | `/loans/:id/repayments` | Add repayment |
| DELETE | `/loans/:id/repayments/:rid` | Remove repayment |

### Fixed Costs `/fixed-costs`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/fixed-costs` | List all fixed costs |
| POST | `/fixed-costs` | Create fixed cost |
| PATCH | `/fixed-costs/:id` | Update fixed cost |
| DELETE | `/fixed-costs/:id` | Delete fixed cost |
| POST | `/fixed-costs/:id/pay` | Mark as paid (creates transaction) |

### Insights `/insights`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insights/dashboard` | Dashboard summary |
| GET | `/insights/spending-by-category?month=YYYY-MM` | Pie chart data |
| GET | `/insights/monthly-income-expense?months=6` | Bar chart data |
| GET | `/insights/spending-trend?months=3` | Line chart data |

### Export `/export`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/export/csv?dateFrom=&dateTo=` | Download CSV |
| GET | `/export/excel?dateFrom=&dateTo=` | Download Excel |

---

## 🛡️ Security

- JWT access tokens (15 min expiry) via Authorization header
- Refresh tokens (7 days) in httpOnly cookies
- Bcrypt password hashing (salt rounds: 12)
- Helmet.js security headers
- CORS restricted to frontend origin
- Rate limiting: 10 req/15min on auth, 100 req/15min general
- Zod validation on all inputs (client + server)

---

## 🎨 Tech Stack

### Frontend
- **React 18** + **Vite 5** — Fast dev/build
- **React Router v6** — Client-side routing
- **TanStack Query v5** — Server state management
- **Tailwind CSS v3** — Utility-first styling
- **Framer Motion** — Animations
- **Recharts** — Charts and visualizations
- **React Hook Form** + **Zod** — Form validation
- **Axios** — HTTP client
- **vite-plugin-pwa** — PWA support

### Backend
- **Express 4** — HTTP server
- **MongoDB** + **Mongoose 8** — Database
- **JWT** — Authentication
- **bcryptjs** — Password hashing
- **Zod** — Request validation
- **Helmet** — Security headers
- **ExcelJS** + **json2csv** — Export functionality

---

## 🌙 Features

- ✅ **Multi-wallet tracking** — Cash, Bank, Mobile Banking, Credit Cards
- ✅ **Income & Expense** — With categories and notes
- ✅ **Wallet Transfers** — Move money between wallets
- ✅ **Monthly Budgets** — Per-category limits with visual warnings
- ✅ **Savings Goals** — Deadline-based with contribution tracking
- ✅ **Loan Tracking** — Borrowed and lent with repayments
- ✅ **Fixed Costs** — Recurring bills with one-click pay
- ✅ **Rich Insights** — Pie, bar, and trend charts
- ✅ **CSV/Excel Export** — Your data, always
- ✅ **Dark Mode** — Easy on the eyes
- ✅ **PWA** — Install on mobile/desktop
- ✅ **Multi-currency** — USD, INR, BDT, EUR, GBP, and more

---

## 📄 License

MIT — Free to use, modify, and distribute.

---

*Built with ❤️ — 100% free, forever.*
