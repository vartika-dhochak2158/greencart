# 🛒 GreenCart

GreenCart is a full-stack MERN grocery delivery web app. Customers can browse products by category, search, manage a cart, save addresses, and check out with Cash on Delivery or Stripe online payments. Sellers get their own dashboard to add products, manage stock, and view orders.

🔗 **Live Demo:** https://greencart-app-ynao.vercel.app

## Features

- 🛍️ Browse products by category (veggies, fruits, dairy, bakery, and more)
- 🔍 Product search
- 🛒 Cart management with persistent items
- 🔐 User authentication (signup/login)
- 📍 Save and manage delivery addresses
- 💳 Checkout via Stripe or Cash on Delivery
- 🧑‍💼 Seller dashboard — add products, update stock, manage orders
- ☁️ Image uploads via Cloudinary

## Tech Stack

**Frontend**
- React (Vite)
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

**Backend**
- Node.js / Express
- MongoDB with Mongoose
- JWT authentication
- Cloudinary (image storage)
- Stripe (payments)
- Multer (file uploads)

**Deployment**
- Vercel (frontend + backend, deployed separately)

## Project Structure

```
greencart/
├── client/          # React frontend
│   ├── src/
│   │   ├── context/     # Global app state (AppContext)
│   │   ├── pages/       # Route-level pages
│   │   ├── components/  # Reusable UI components
│   │   └── assets/       # Images and static assets
│   └── vercel.json
│
└── server/          # Express backend
    ├── configs/         # DB, Cloudinary configs
    ├── controllers/     # Route logic
    ├── middlewares/      # Auth middleware
    ├── models/          # Mongoose schemas
    ├── routes/           # API route definitions
    ├── server.js
    └── vercel.json
```

## Getting Started Locally

### Prerequisites
- Node.js (v18+)
- A MongoDB database (e.g. MongoDB Atlas)
- A Cloudinary account
- A Stripe account (for online payments)

### 1. Clone the repo
```bash
git clone https://github.com/vartika-dhochak2158/greencart.git
cd greencart
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

Run the backend:
```bash
npm run server
```
The API will run on `http://localhost:4000`.

### 3. Set up the frontend
```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:
```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=$
```

Run the frontend:
```bash
npm run dev
```
The app will run on `http://localhost:5173`.

## Deployment Notes

Both `client` and `server` are deployed as **separate projects on Vercel**, each with its own `vercel.json`:

- Frontend Vercel project → **Root Directory:** `client`
- Backend Vercel project → **Root Directory:** `server`

Make sure to set these environment variables in the respective Vercel project's dashboard (Environment Variables), since `.env` files are not committed to the repo:

- **Backend:** `MONGODB_URI`, `JWT_SECRET`, `CLOUDINARY_*`, `STRIPE_*`
- **Frontend:** `VITE_BACKEND_URL` (pointing to the deployed backend URL), `VITE_CURRENCY`

Also double check in `server/server.js` that `allowedOrigins` includes your deployed frontend URL, or cross-origin requests will be blocked.

## License

This project is for educational/portfolio purposes.
