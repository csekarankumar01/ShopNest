# ShopNest 🛒

A full-stack e-commerce platform built with **React 18** (frontend) and **Node.js / Express** (backend), backed by **MongoDB** and deployed on Vercel + Render.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User authentication** — JWT-based register/login with protected routes
- **Product catalog** — Browse, search, and filter products with Cloudinary-hosted images
- **Shopping cart** — Persistent cart state managed with Redux Toolkit
- **Secure checkout** — Razorpay payment gateway integration
- **Order tracking** — Real-time order status updates for customers
- **Admin dashboard** — Add/edit/delete products, view all orders, basic analytics
- **Email notifications** — Transactional emails for order confirmation and auth flows
- **Responsive UI** — Works across desktop and mobile

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Redux Toolkit | Cart & global state management |
| React Router v6 | Client-side routing |
| Context API | Authentication state |
| CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication tokens |
| Cloudinary | Image upload & storage |
| Razorpay | Payment processing |
| Nodemailer | Transactional email |

---

## System Architecture

```
┌──────────────────────────────────────────────────┐
│                  Client (Browser)                │
└────────────────────┬─────────────────────────────┘
                     │ HTTPS / REST
┌────────────────────▼─────────────────────────────┐
│               React Frontend (Vercel)            │
│  ┌──────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Pages   │  │ Admin Panel │  │ Redux/CTX   │ │
│  └──────────┘  └─────────────┘  └─────────────┘ │
└────────────────────┬─────────────────────────────┘
                     │ Axios API calls
┌────────────────────▼─────────────────────────────┐
│              Express API (Render)                │
│  ┌──────────────┐  ┌──────────┐  ┌────────────┐ │
│  │ Auth Middle. │  │  Routes  │  │Controllers │ │
│  └──────────────┘  └──────────┘  └────────────┘ │
└───────┬────────────────┬─────────────┬───────────┘
        │                │             │
┌───────▼──────┐  ┌──────▼──────┐  ┌──▼──────────┐
│  Cloudinary  │  │  Razorpay   │  │   Nodemailer│
│ (images)     │  │ (payments)  │  │   (email)   │
└──────────────┘  └─────────────┘  └─────────────┘
        │
┌───────▼──────────────────────────────────────────┐
│                 MongoDB Atlas                    │
│   ┌─────────┐  ┌──────────┐  ┌────────────┐    │
│   │  Users  │  │ Products │  │   Orders   │    │
│   └─────────┘  └──────────┘  └────────────┘    │
└──────────────────────────────────────────────────┘
```

---

## Project Structure

```
ShopNest/
├── backend/
│   ├── config/          # DB connection, Cloudinary, Razorpay setup
│   ├── controllers/     # Business logic (auth, products, orders)
│   ├── middleware/       # JWT auth, error handling
│   ├── models/          # Mongoose schemas (User, Product, Order)
│   ├── routes/          # Express route definitions
│   ├── uploads/         # Temp local uploads before Cloudinary
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── pages/       # Route-level components (Home, Product, Cart…)
│       ├── admin/       # Admin-only dashboard pages
│       ├── components/  # Shared UI components
│       ├── context/     # AuthContext provider
│       ├── redux/       # Store, slices (cartSlice, etc.)
│       ├── utils/       # Axios instance, API helpers
│       └── styles/      # Global and component CSS
│
├── DEPLOYMENT_GUIDE.md
├── SECURITY.md
├── start.sh
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 16 or higher
- **MongoDB** — Atlas cluster (recommended) or local instance
- **Cloudinary** account (free tier works)
- **Razorpay** account (test keys available in dashboard)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/csekarankumar01/ShopNest.git
cd ShopNest
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

**Frontend** — create `frontend/.env.local`:

```env
REACT_APP_API_URL=http://localhost:8000
```

### Running Locally

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
# API running at http://localhost:8000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
# App running at http://localhost:3000
```

---

## API Overview

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/products` | List all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/orders` | Get user's orders | User |
| POST | `/api/orders` | Place an order | User |
| GET | `/api/orders/all` | Get all orders | Admin |
| POST | `/api/payment/verify` | Verify Razorpay payment | User |

---

## Deployment

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set the **root directory** to `frontend`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend.onrender.com`
5. Deploy

### Backend → Render

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set **root directory** to `backend`
4. Set **start command** to `npm start`
5. Add all backend environment variables from your `.env` file
6. Deploy

> **Live demo:** [shop-nest-shopping-app.vercel.app](https://shop-nest-shopping-app.vercel.app)

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow existing code style and add comments where logic is non-obvious.

---

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting guidelines.

---

## License

ISC — see [LICENSE](./LICENSE) for details.

---

*Built by [csekarankumar01](https://github.com/csekarankumar01)*
