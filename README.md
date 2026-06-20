# ShopNest

A full-stack e-commerce platform built with React and Node.js.

## Quick Start

### Prerequisites
- Node.js 16+
- MongoDB (Atlas or local)

### Installation

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Environment Setup

**Backend** - Create `.env` in `backend/`:
```
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

**Frontend** - Create `.env.local` in `frontend/`:
```
REACT_APP_API_URL=http://localhost:8000
```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000

## Project Structure

```
├── backend/          # Express.js API server
│   ├── config/       # Database & external service configs
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── middleware/   # Auth & request processing
│   └── uploads/      # User uploads
├── frontend/         # React application
│   ├── src/
│   │   ├── pages/    # Route components
│   │   ├── admin/    # Admin panels
│   │   ├── components/
│   │   ├── context/  # Auth context
│   │   ├── redux/    # Cart state management
│   │   ├── utils/    # API calls & helpers
│   │   └── styles/
│   └── public/
└── README.md
```

## Deployment

### Frontend - Vercel
1. Push to GitHub
2. Import project in Vercel, set root directory to `frontend`
3. Add environment variable: `REACT_APP_API_URL=your_backend_url`

### Backend - Render
1. Push to GitHub  
2. Create Web Service in Render
3. Set root directory to `backend`
4. Set start command: `npm start`
5. Add all environment variables from `.env`

## Features

- User authentication with JWT
- Product catalog & search
- Shopping cart (Redux)
- Secure checkout with Razorpay
- Admin dashboard (add/edit products, view orders)
- Order tracking
- Analytics

## Technologies

**Backend:**
- Express.js
- MongoDB & Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Razorpay (payments)

**Frontend:**
- React 18
- Redux Toolkit
- React Router v6
- CSS

## License

ISC
