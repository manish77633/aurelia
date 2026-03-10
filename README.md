# 💎 Aurelia Luxe — Full-Stack E-Commerce


<img width="1917" height="926" alt="Screenshot 2026-03-10 072116" src="https://github.com/user-attachments/assets/085a7ec0-5e5b-4446-bcf9-ba6ca24ae530" />

> Ultra-premium luxury marketplace built with React, Node.js, MongoDB & Redux Toolkit.

## 🚀 Quick Start

### 1. Seed the Database (30 Products + Admin User)
```bash
cd backend
npm install
node seeder.js
```
This creates **30 luxury products** + admin: `admin@aurelia.com` / `admin123456`

### 2. Start Backend
```bash
cd backend
npm run dev    # runs on http://localhost:5000
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm start      # runs on http://localhost:3000
```

---

## 🗂️ Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, Marquee, Featured Products, Testimonials, FAQ |
| Collection | `/shop` | Sidebar filters (category/color/price), sort, search |
| Product | `/product/:id` | Full detail, color variants, reviews, related products |
| Cart | `/cart` | Qty controls, free shipping nudge |
| Checkout | `/checkout` | 3-step form (Personal → Shipping → Razorpay) |
| Orders | `/orders` | Order history with status badges |
| Wishlist | `/wishlist` | Saved items with gold heart icon |
| Profile | `/profile` | Update name/email/password |
| About | `/about` | Brand story, milestones, Meet the Founder |
| Admin | `/admin` | Dashboard, Products (URL + file upload), Orders, Users |
| Login/Register | `/login` `/register` | JWT + Google OAuth |

## 🔑 Admin Access
Admin is pre-created by seeder: `admin@aurelia.com` / `admin123456`

Or promote any user via MongoDB:
```js
db.users.updateOne({ email: "you@email.com" }, { $set: { role: "admin" } })
```

## 📁 Tech Stack
- **Frontend:** React 18, Redux Toolkit, React Router v6, MUI Icons, React Toastify
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Passport (Google OAuth)
- **Payments:** Razorpay
- **Image Upload:** Multer + Cloudinary (set `.env` keys to enable)
- **Email:** Nodemailer (Gmail)
