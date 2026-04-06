# 🛍 Online Clothing Store - Setup & Run Guide

## Project Overview
This is a **full-stack e-commerce application** with three components:
- 🛒 **Frontend**: Customer shopping interface (React + Vite)
- 👨‍💼 **Admin**: Admin dashboard for product & order management (React + Vite)
- ⚙️ **Backend**: Express.js API server with MongoDB

---

## ✅ Installation Status
All dependencies have been installed successfully:
- ✓ Backend: 214 packages installed
- ✓ Frontend: 358 packages installed  
- ✓ Admin: 358 packages installed

---

## 🚀 Running the Project

### **Option 1: Run All Three Services Simultaneously (Recommended)**

Open 3 separate terminals and run these commands:

**Terminal 1 - Backend (API Server)**
```bash
cd backend
npm run server
```
- Runs on: **http://localhost:4000**
- Uses: Nodemon (auto-restart on changes)

**Terminal 2 - Frontend (Customer App)**
```bash
cd frontend
npm run dev
```
- Runs on: **http://localhost:5173**
- Connected to backend at: `http://localhost:4000`

**Terminal 3 - Admin Dashboard**
```bash
cd admin
npm run dev
```
- Runs on: **http://localhost:5174**
- Connected to backend at: `http://localhost:4000`

---

### **Option 2: Run Individual Services**

**Backend Only:**
```bash
cd backend
npm start           # Single run
npm run server      # Development with auto-reload (nodemon)
```

**Frontend Only:**
```bash
cd frontend
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
```

**Admin Only:**
```bash
cd admin
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
```

---

## ⚙️ Environment Configuration

### Backend (.env)
Located at: `backend/.env`

```
JWT_SECRET = "greatstack"
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "greatstack123"
MONGODB_URI = "mongodb+srv://Admin:admin123@cluster0.bgomn.mongodb.net"
CLOUDINARY_API_KEY = "531769495253932"
CLOUDINARY_SECRET_KEY = "x01rmiBjTSdOl9Ao4UrNRF_lfeY"
CLOUDINARY_NAME = "dndi3jn1n"
STRIPE_SECRET_KEY = "-------- Paste Stripe Secret key --------"
RAZORPAY_KEY_SECRET = '-------- Paste Razorpay Secret key --------'
RAZORPAY_KEY_ID = '-------- Paste Razorpay key Id --------'
PORT = 4000 (default)
```

**Note:** Payment gateway keys (Stripe, Razorpay) need to be updated with actual keys for payment functionality.

### Frontend (.env)
Located at: `frontend/.env`

```
VITE_BACKEND_URL = "http://localhost:4000"
VITE_RAZORPAY_KEY_ID = '-------- Paste Razorpay key Id --------'
```

### Admin (.env)
Located at: `admin/.env`

```
VITE_BACKEND_URL = "http://localhost:4000"
```

---

## 📚 Tech Stack Details

### Backend
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT
- **Image Upload**: Cloudinary
- **Payment Gateways**: Stripe, Razorpay
- **File Upload**: Multer
- **Password Hashing**: Bcrypt
- **Dev Tool**: Nodemon

### Frontend & Admin
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Toastify
- **Linting**: ESLint

---

## 🌐 API Endpoints

The backend provides the following endpoints:

- **User Routes**: `/api/user/` (Login, Register, Profile)
- **Product Routes**: `/api/product/` (Browse, Filter, Search)
- **Cart Routes**: `/api/cart/` (Add, Remove, Update Items)
- **Order Routes**: `/api/order/` (Create, Track, Payment)

---

## 🔑 Default Admin Credentials

```
Email: admin@example.com
Password: greatstack123
```

---

## 🛠️ Useful Commands

| Command | Location | Purpose |
|---------|----------|---------|
| `npm run server` | backend | Start backend with auto-reload |
| `npm start` | backend | Start backend (single run) |
| `npm run dev` | frontend/admin | Start development server |
| `npm run build` | frontend/admin | Create production build |
| `npm run preview` | frontend/admin | Preview production build |
| `npm run lint` | frontend/admin | Run ESLint checks |

---

## 📱 Access Points

| Application | URL | Purpose |
|-------------|-----|---------|
| Backend API | http://localhost:4000 | API server |
| Frontend (Store) | http://localhost:5173 | Customer shopping |
| Admin Dashboard | http://localhost:5174 | Manage products/orders |

---

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB connection string is valid
- Check if port 4000 is available
- Verify all environment variables in `.env`

### Frontend/Admin won't compile
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear `.vite` cache: `rm -rf .vite`
- Ensure Node.js version is 16+

### Cannot connect to backend
- Verify backend is running on port 4000
- Check `VITE_BACKEND_URL` in frontend/.env and admin/.env
- Ensure CORS is enabled (it is in server.js)

---

## 📝 Notes

- All three services must be running together for full functionality
- MongoDB must be accessible for backend to work
- Payment gateways are placeholder entries until configured with real keys
- Cloudinary credentials are configured for image uploads

---

## 🚀 Next Steps

1. ✅ Dependencies installed
2. ✅ Environment variables configured
3. 🔄 Start all three services in separate terminals
4. 📌 Access the applications using URLs above
5. 🧪 Test the full flow: Browse → Add to Cart → Checkout

Happy shopping! 🛍️
