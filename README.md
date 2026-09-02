# 🌾 KisanConnect — Farmer-to-Consumer Direct Marketplace

**KisanConnect** is a modern full-stack web application designed to empower Indian farmers by enabling direct marketplace access to consumers, institutions, and retailers. It eliminates middleman commissions (saving buyers 25–35% while granting farmers 30%+ higher realization), provides full price transparency, and scaffolds local aggregation hub logistics.

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Lucide Icons, React Context API.
- **Backend API**: Node.js, Express.js, TypeScript, JWT Authentication, Multer file upload.
- **Database & ORM**: PostgreSQL, Prisma ORM.
- **DevOps**: Docker Compose (`docker-compose.yml`).

---

## 📂 Project Structure

```
kisan-connect/
├── docker-compose.yml        # Local PostgreSQL 16 service
├── .env.example              # Sample environment configuration
├── README.md                 # Project guide & documentation
├── package.json              # Root workspace scripts
│
├── backend/                  # Express + TypeScript API Server
│   ├── prisma/
│   │   ├── schema.prisma     # Prisma Data Models (User, Produce, Order, Hub)
│   │   └── seed.ts           # 5 Farmers, 10 Produce items, 3 Buyers, Hubs, Orders
│   ├── src/
│   │   ├── controllers/      # Auth, Produce, Order, User, Hub, AI, Upload
│   │   ├── routes/           # REST endpoints
│   │   ├── middlewares/      # JWT Auth & Role guards, Multer
│   │   ├── services/         # Prisma client singleton
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server entrypoint
│   ├── uploads/              # Local disk storage for uploaded produce photos
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/                 # Next.js 14+ App Router Frontend
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # Root layout with providers & Navbar
    │   │   ├── page.tsx      # Landing page with hero & Price Transparency
    │   │   ├── marketplace/  # Crop catalog with filters, search, and sorting
    │   │   ├── produce/[id]/ # Detail view with interactive price breakdown
    │   │   ├── farmer/       # Farmer dashboard (inventory & order dispatch)
    │   │   ├── orders/       # Buyer orders tracking timeline
    │   │   ├── checkout/     # Checkout with doorstep/hub pickup options
    │   │   ├── admin/        # Admin panel & AI Sandbox
    │   │   ├── login/        # Login page + 1-Click Demo persona switchers
    │   │   └── register/     # Registration with role selection
    │   ├── components/       # Reusable UI components
    │   ├── context/          # AuthContext & CartContext
    │   ├── lib/              # API client & helper utilities
    │   └── types/            # TypeScript interfaces
    ├── package.json
    └── tailwind.config.ts
```

---

## 🚀 Single-Command Startup

You can launch the entire stack (Database + Backend API + Frontend Next.js app) with **a single command**:

### Option 1: Native Node.js & Docker (Recommended for Dev)
From the project root:
```bash
npm run dev
```
> This checks/starts the PostgreSQL container and simultaneously boots the Express Backend (`:5000`) and Next.js Frontend (`:3000`).

---

### Option 2: Full Docker Containerization
If you prefer running everything inside isolated Docker containers:
```bash
docker compose up
```
> This builds and starts the `postgres`, `kisanconnect-backend`, and `kisanconnect-frontend` containers together in one command.

---

*Database will be available at `localhost:5432` with database name `kisanconnect`.*

### 3. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Push the Prisma schema to the database:
   ```bash
   npm run db:push
   ```
5. Seed the database with 5 farmers, 10 produce items, 3 buyers, and sample hubs/orders:
   ```bash
   npm run db:seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Backend API runs at: `http://localhost:5000`*

### 4. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Copy environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *Frontend application runs at: `http://localhost:3000`*

---

## 👥 Seed Accounts & Demo Logins

All demo accounts use the default password: **`password123`**

### Farmers
1. **Ramesh Kumar Patil** (Nashik) — Phone: `9820011111` | Email: `ramesh.patil@kisan.in`
2. **Gurpreet Singh** (Karnal) — Phone: `9820022222` | Email: `gurpreet.singh@kisan.in`
3. **Suresh Chandra Sharma** (Shimla) — Phone: `9820033333` | Email: `suresh.sharma@kisan.in`
4. **Lakshmi Devi** (Guntur) — Phone: `9820044444` | Email: `lakshmi.devi@kisan.in`
5. **Rajesh Verma** (Ratnagiri) — Phone: `9820055555` | Email: `rajesh.verma@kisan.in`

### Buyers
1. **Priya Sharma** (Pune) — Phone: `9810011111` | Email: `priya.sharma@gmail.com`
2. **Anita Rao** (Mumbai) — Phone: `9810022222` | Email: `anita.rao@freshorganics.com`
3. **Vikas Mehta** (Noida) — Phone: `9810033333` | Email: `vikas.mehta@outlook.com`

### Admin
- **KisanConnect Admin** — Phone: `9999999999` | Email: `admin@kisanconnect.in`

> 💡 **Tip:** Use the **"Demo Persona Switcher"** in the top navigation bar or on the login page to seamlessly switch between Farmer, Buyer, and Admin modes with 1-click without re-typing credentials!

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new user (`FARMER` or `BUYER`).
- `POST /api/auth/login` — Login with phone/email and password.
- `GET /api/auth/me` — Retrieve current authenticated user profile.
- `GET /api/auth/demo-accounts` — List pre-seeded demo accounts.

### Produce Catalog (`/api/produce`)
- `GET /api/produce` — Browse/search produce listings with query parameters (`search`, `category`, `location`, `minPrice`, `maxPrice`, `qualityGrade`, `status`, `farmerId`, `sortBy`).
- `GET /api/produce/:id` — Get produce listing by ID with farmer and hub details.
- `POST /api/produce` — Create a new produce listing *(Farmer/Admin only)*.
- `PUT /api/produce/:id` — Update produce listing *(Farmer owner or Admin)*.
- `DELETE /api/produce/:id` — Delete produce listing *(Farmer owner or Admin)*.

### Orders (`/api/orders`)
- `POST /api/orders` — Place a direct purchase order *(Buyer/Admin)*.
- `GET /api/orders/my-orders` — Get buyer's orders with tracking history.
- `GET /api/orders/farmer-orders` — Get incoming orders for farmer's produce.
- `GET /api/orders/all` — Get all platform orders *(Admin only)*.
- `PATCH /api/orders/:id/status` — Update order status (`PENDING` ➔ `CONFIRMED` ➔ `PICKED_UP` ➔ `DELIVERED`).

### Aggregation Hubs (`/api/hubs`)
- `GET /api/hubs` — List all local aggregation pickup and collection hubs.
- `GET /api/hubs/:id` — Hub details and active produce inventory.
- `POST /api/hubs` — Create a new hub *(Admin only)*.

### Photo Uploads (`/api/upload`)
- `POST /api/upload` — Upload crop image (Multipart `image`).

### Mock AI Endpoints (Placeholder Scaffolding)
- `GET /api/forecast?crop=tomatoes&location=Nashik` — Returns mock multi-week price projections, demand sentiment index, and weather advisory.
- `POST /api/route-optimize` — Returns mock multi-hub pickup route sequencing, distance, and fuel savings analysis.

---

## 🌟 Key Features

1. **Farmer Dashboard**: Add/edit crops with photo upload, live price calculator, stock management, and order dispatch workflow.
2. **Buyer Marketplace**: Fast category filtering, location filter, quality grade tags, price slider, and responsive card grid.
3. **Price Transparency Widget**: On-listing comparison showing Farmer's base price vs. Platform handling fee vs. Traditional Middleman/Supermarket retail markup.
4. **Order Flow & Tracking**: Basket / Buy Now ➔ Doorstep Delivery or Hub Pickup selection ➔ 4-step live order tracking timeline.
5. **Admin Console & AI Labs**: Complete platform moderation + interactive testing playground for crop forecasting and route optimization.
