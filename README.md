# 🏫 Campus Lost & Found Portal

A complete, production-quality full-stack web application built to help students, faculty, and campus security staff report lost items, report found items, search belongings, submit ownership verification claims, and manage asset returns safely.

---

## 🌟 Key Features

- 🔍 **Instant Search & Filter Bar**: Search by item name, category (*Electronics, Documents, Accessories, Bags, Keys, Clothing, Other*), status (*Lost, Found, Claimed, Returned*), and location.
- 📸 **Image Upload**: Drag-and-drop photo uploader with file validation (PNG, JPG, JPEG <= 5MB), live image preview, and explicit remove button (starts strictly empty without default placeholders).
- 🔐 **Privacy-Protected Claim Verification**: Finders set verification prompts (e.g., *"What lockscreen wallpaper is on the phone?"*). Genuine owners respond with detailed proof for admin review.
- 🛡️ **Role-Based Admin Portal**: Campus security admins can view total metrics, approve/reject claims, mark items as returned, and moderate listings.
- 🔔 **In-App & Email Notifications**: Automatic notifications on claim submission, approval/rejection, item return, and new matching lost & found items.
- ☁️ **Flexible Storage**: AWS S3 integration with seamless local disk fallback for zero-config offline development.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State & HTTP**: Axios & React Context API
- **Icons & Motion**: React Icons & Framer Motion

### Backend
- **Framework**: Python FastAPI
- **Server**: Uvicorn
- **ORM & Validation**: SQLAlchemy & Pydantic v2
- **Auth**: JWT Authentication & Passlib (Bcrypt)
- **Database**: PostgreSQL (with SQLite zero-config dev option)
- **Storage**: AWS S3 with local disk storage fallback

---

## 📁 Project Structure

```
Campus-Lost-Found-Portal/
├── frontend/
│   ├── src/
│   │   ├── assets/           # Static logos and graphic assets
│   │   ├── components/       # Reusable components (Navbar, Footer, ItemCard, ImageUpload, SearchBar, StatusBadge, etc.)
│   │   ├── pages/            # Home, LostItems, FoundItems, ItemDetails, ReportLost, ReportFound, ClaimItem, UserDashboard, AdminDashboard, Notifications, Login, Register, About
│   │   ├── services/         # Axios API service client
│   │   ├── context/          # Auth & Notification State Context
│   │   ├── data/             # Realistic campus mock data
│   │   ├── App.jsx           # Application Router
│   │   └── main.jsx          # React entrypoint
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point & CORS
│   │   ├── database/         # Session & DB engine setup
│   │   ├── models/           # SQLAlchemy ORM models (User, Item, Claim, Notification)
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── routes/           # Auth, Items, Claims, Notifications, Admin endpoints
│   │   ├── services/         # S3/Local Storage & Email Notification services
│   │   ├── middleware/       # JWT Auth verification
│   │   └── utils/            # Password hashing & DB seeder
│   ├── uploads/              # Local storage folder for uploaded item images
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
└── .gitignore
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+) & **npm**
- **Python** (3.10+)

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will launch at `http://localhost:3000`.

---

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend server will start at `http://localhost:8000`. API documentation is available at `http://localhost:8000/docs`.

---

## 🔑 Pre-Seeded Demo Accounts

The database comes pre-seeded with sample campus data and ready-to-use demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@campus.edu` | `admin123` |
| **Student** | `student@campus.edu` | `student123` |

---

## 🔒 Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory to configure custom settings:

```env
DATABASE_URL=sqlite:///./campus_lost_found.db
JWT_SECRET=super_secret_jwt_key_campus_lost_found_2026

# Optional AWS S3 Credentials
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=campus-lost-found-images
```

---

## 📄 License
© 2026 Campus Lost & Found. All Rights Reserved.
