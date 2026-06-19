# ShopNest - Separate Frontend & Backend Setup

This project is now set up to run the backend and frontend independently.

## Prerequisites
- Node.js and npm installed
- MongoDB connection string configured

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Check `.env` file has:
- `PORT=8000`
- `MONGO_URI=<your_mongodb_connection_string>`
- `JWT_SECRET=<your_secret_key>`
- `FRONTEND_URL=http://localhost:3000`
- `CLIENT_URLS=http://localhost:3000`
- Email, Cloudinary, and Razorpay credentials

### 4. Start the backend server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Backend will be available at: `http://localhost:8000`

---

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create or check `.env.local` file has:
```
REACT_APP_API_URL=http://localhost:8000
```

### 4. Start the frontend development server
```bash
npm start
```

Frontend will be available at: `http://localhost:3000`

---

## Running Both Simultaneously

You can run both in separate terminal windows:

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

Both will communicate via the configured API URL.

---

## Environment Variables Reference

### Backend (.env)
| Variable | Purpose | Default |
|----------|---------|---------|
| PORT | Server port | 8000 |
| MONGO_URI | MongoDB connection string | Required |
| JWT_SECRET | JWT signing secret | Required |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| CLIENT_URLS | Additional allowed URLs | http://localhost:3000 |
| EMAIL_USER | Email for notifications | Required |
| EMAIL_PASS | Email password | Required |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | Required |
| CLOUDINARY_API_KEY | Cloudinary API key | Required |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Required |
| RAZORPAY_KEY_ID | Razorpay test key ID | Required |
| RAZORPAY_KEY_SECRET | Razorpay test secret | Required |

### Frontend (.env.local)
| Variable | Purpose | Default |
|----------|---------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:8000 |

---

## Troubleshooting

### CORS Errors
- Ensure backend's `FRONTEND_URL` matches your frontend URL
- Check that backend is running on the correct port

### API Not Connecting
- Verify `REACT_APP_API_URL` in frontend `.env.local`
- Check backend is running and accessible

### Database Connection Issues
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes your machine
