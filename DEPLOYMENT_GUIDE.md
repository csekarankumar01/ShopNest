# ShopNest Deployment Guide

## GitHub Repository
**Repository**: https://github.com/csekarankumar01/ShopNest

---

## Quick Deployment Steps

### Backend Deployment (Render)

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New" → "Web Service"
   - Select the ShopNest repository
   - Configure:
     - **Name**: `shopnest-backend`
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Root Directory**: `backend`

3. **Set Environment Variables** (in Render Dashboard)
   ```
   PORT=8000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
   CLIENT_URLS=https://your-vercel-frontend-url.vercel.app
   EMAIL_USER=your_email
   EMAIL_PASS=your_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. **Deploy** and get your backend URL

---

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Deploy Frontend**
   - Click "Add New" → "Project"
   - Select ShopNest repository
   - Configure:
     - **Framework**: React
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Set Environment Variable**
   ```
   REACT_APP_API_URL=https://your-render-backend-url.onrender.com
   ```

4. **Deploy** and get your frontend URL

---

## Testing the Deployment

Once both are deployed:

1. Visit your Vercel frontend URL
2. Try logging in with test credentials
3. Browse products
4. Test checkout functionality

---

## Status

✅ **Backend**: Working locally on http://localhost:8000
✅ **Frontend**: Working locally on http://localhost:3000
✅ **Database**: MongoDB Atlas configured
✅ **Code**: Pushed to GitHub

Ready for production deployment!
