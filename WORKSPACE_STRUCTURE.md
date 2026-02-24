# 📁 Workspace Structure & File Purposes

Penjelasan lengkap tentang setiap folder dan file penting dalam project Anda.

---

## 🏗️ Struktur Lengkap

```
c:\pakain stm\
│
├─ 📄 README_SETUP.md ⭐ BACA PERTAMA
├─ 📄 SETUP_CHECKLIST.md ⭐ CHECKLIST STEP-BY-STEP
├─ 📄 PGADMIN_SETUP.md (Detail pgAdmin)
├─ 📄 FILES_GUIDE.md (Penjelasan semua file baru)
├─ 📄 DATABASE_SETUP.md (Info database awal)
├─ 📄 VERIFICATION_STATUS.md (Status verifikasi)
├─ 📄 WORKSPACE_STRUCTURE.md ← File ini
│
├─ 📂 backend/ ⭐ NODE.JS + DATABASE SERVER
│  ├─ 📄 package.json ✏️ UPDATE (npm scripts baru)
│  ├─ 📄 setup-and-seed.bat ⭐ SCRIPT SETUP (Windows)
│  ├─ 📄 setup-and-seed.sh (Script setup Linux/Mac)
│  ├─ 📄 .env.example (Template environment)
│  ├─ 📄 .env (Credentials - JANGAN commit ke git)
│  │
│  ├─ 📂 src/ (Source code)
│  │  ├─ 🔑 server.js (Main server file)
│  │  ├─ 🔑 setup-db.js (CREATE TABLE - jalankan 1x)
│  │  ├─ 🔑 seed-data.js (INSERT data - jalankan 1x)
│  │  ├─ 📋 test-db.js (Test connection)
│  │  ├─ verify-data.js (Verify data)
│  │  ├─ swagger.js (API documentation)
│  │  │
│  │  ├─ 📂 db/
│  │  │  └─ pool.js (Database connection pool)
│  │  │
│  │  ├─ 📂 middleware/
│  │  │  ├─ auth.js (JWT authentication)
│  │  │  └─ roles.js (Role-based access control)
│  │  │
│  │  └─ 📂 routes/
│  │     ├─ auth.js (Login, Register, Logout)
│  │     ├─ users.js (User management)
│  │     ├─ products.js (Product CRUD)
│  │     ├─ categories.js (Category CRUD)
│  │     └─ transactions.js (Transaction handling)
│  │
│  └─ 📂 public/ (Static files / upload - optional)
│
├─ 📂 login-dashboard/ ⭐ REACT FRONTEND
│  ├─ 📄 package.json
│  ├─ 📄 README.md
│  │
│  ├─ 📂 public/
│  │  ├─ index.html (Main HTML)
│  │  ├─ manifest.json (PWA config)
│  │  └─ robots.txt
│  │
│  └─ 📂 src/
│     ├─ 🔑 index.js (React entry point)
│     ├─ 🔑 App.js (Main component)
│     │
│     ├─ 📄 App.jsx (App component)
│     ├─ 📄 App.css
│     │
│     ├─ 📄 Login.jsx (Login page)
│     ├─ 📄 Login.css
│     │
│     ├─ 📄 Register.jsx (Register page)
│     ├─ 📄 Register.css
│     │
│     ├─ 📄 Dashboard.jsx (Main dashboard)
│     ├─ 📄 Dashboard.css
│     │
│     ├─ 📂 pages/
│     │  └─ Register.jsx, Register.css
│     │
│     ├─ 📂 services/
│     │  └─ apiService.js (API calls)
│     │
│     └─ 📂 setupTests.js, reportWebVitals.js (Config files)
│
└─ 📄 .gitignore (Files to ignore in git)
```

---

## 🔑 File-File Penting

### 🎯 Yang Harus Dibaca Dulu

| File | Tujuan | Waktu |
|------|--------|-------|
| [README_SETUP.md](../README_SETUP.md) | Quick start 3 langkah | 2 min |
| [SETUP_CHECKLIST.md](../SETUP_CHECKLIST.md) | Step-by-step checklist | 15 min |

### 📊 Database Related

| File | Tujuan |
|------|--------|
| `backend/src/db/pool.js` | Database connection |
| `backend/src/setup-db.js` | Create tables (jalankan 1x) |
| `backend/src/seed-data.js` | Insert test data (jalankan 1x) |
| `backend/.env` | Database credentials |

### 🚀 Server Related

| File | Tujuan |
|------|--------|
| `backend/src/server.js` | Express main server |
| `backend/src/swagger.js` | API documentation |
| `backend/src/routes/*.js` | API endpoints |
| `backend/src/middleware/*.js` | Auth, roles validation |

### 🎨 Frontend Related

| File | Tujuan |
|------|--------|
| `login-dashboard/src/App.js` | Main app component |
| `login-dashboard/src/Login.jsx` | Login page |
| `login-dashboard/src/Register.jsx` | Register page |
| `login-dashboard/src/Dashboard.jsx` | Main dashboard |
| `login-dashboard/src/services/apiService.js` | API calls |

### ⚙️ Scripts

| File | Command | Tujuan |
|------|---------|--------|
| `backend/setup-and-seed.bat` | Double-click | Setup DB (Windows) |
| `backend/setup-and-seed.sh` | `bash setup-and-seed.sh` | Setup DB (Linux/Mac) |
| `backend/package.json` | `npm run setup-all` | Setup DB via NPM |
| `backend/package.json` | `npm run setup-db` | Create tables only |
| `backend/package.json` | `npm run seed-db` | Insert data only |
| `backend/package.json` | `npm start` | Run backend server |
| `login-dashboard/package.json` | `npm start` | Run frontend |

---

## 📊 Database Structure

### Tables (yang akan dibuat otomatis)

```
┌─────────────────────────────────────────┐
│ users                                   │
├──────┬────────┬───────────┬──────┬──────┤
│ id   │ name   │ email     │ role │ ...  │
├──────┼────────┼───────────┼──────┼──────┤
│ AUTO │ String │ UNIQUE    │ anum │ ...  │
└──────┴────────┴───────────┴──────┴──────┘

┌─────────────────────────────┐
│ categories                  │
├──────┬────────┬─────────────┤
│ id   │ name   │ description │
├──────┼────────┼─────────────┤
│ AUTO │ UNIQUE │ TEXT        │
└──────┴────────┴─────────────┘

┌──────────────────────────────────────────┐
│ products                                 │
├──────┬────────┬────────┬───────┬─────────┤
│ id   │ name   │ price  │ stock │ cat_id  │
├──────┼────────┼────────┼───────┼─────────┤
│ AUTO │ String │ Decimal│ INT   │ FOREIGN │
└──────┴────────┴────────┴───────┴─────────┘

┌──────────────────────────────┐
│ transactions                 │
├──────┬────────┬──────────────┤
│ id   │ user_id│ total_price  │
├──────┼────────┼──────────────┤
│ AUTO │FOREIGN │ Decimal      │
└──────┴────────┴──────────────┘

┌───────────────────────────────┐
│ transaction_items             │
├──────┬──────────┬──────────────┤
│ id   │ trans_id │ product_id   │
├──────┼──────────┼──────────────┤
│ AUTO │ FOREIGN  │ FOREIGN      │
└──────┴──────────┴──────────────┘
```

---

## 🔐 Environment Variables (.env)

File: `backend/.env`

```env
# Database
PGUSER=postgres
PGHOST=localhost
PGDATABASE=toko_online
PGPASSWORD=postgres
PGPORT=5432

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_here
JWT_EXPIRE=7d
```

**Catatan:** File `.env` tidak di-commit ke git untuk keamanan.

---

## 🌐 Ports

| Service | Port | URL |
|---------|------|-----|
| PostgreSQL | 5432 | - |
| pgAdmin | 5050 | http://localhost:5050 |
| Backend (API) | 5000 | http://localhost:5000 |
| Frontend (React) | 3000 atau 3001 | http://localhost:3000 atau 3001 |

---

## 📝 How To...

### Jalankan Backend
```bash
cd backend
npm install  # Jika belum
npm start
```

### Jalankan Frontend
```bash
cd login-dashboard
npm install  # Jika belum
npm start
```

### Setup Database (Pilih Satu)
```bash
# Option 1: Windows
c:\pakain stm\backend\setup-and-seed.bat

# Option 2: NPM
npm run setup-all

# Option 3: Manual
node src/setup-db.js
node src/seed-data.js
```

### View Data di pgAdmin
1. Buka pgAdmin
2. Connect ke: localhost:5432
3. User: postgres, Password: postgres
4. Database: toko_online
5. Tables → View/Edit Data

### Update Database Schema
1. Edit `backend/src/setup-db.js`
2. Jalankan `npm run setup-db` (akan skip jika table sudah ada)
3. Atau drop database manual dan jalankan lagi

---

## 📦 Dependencies

### Backend (Node.js)
- **express** - Web framework
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT auth
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **swagger-jsdoc & swagger-ui-express** - API docs

### Frontend (React)
- **react** - UI framework
- **ReactDOM** - React DOM rendering
- **react-router** - Routing (jika ada)
- **axios** atau fetch - HTTP requests

---

## 🔗 File Relationships

```
api-call flow:
Frontend (React) 
    ↓ (POST /auth/login)
Backend (Express)
    ↓ (Query database)
Database (PostgreSQL)
    ↓ (Return data)
Backend (Express)
    ↓ (Return JWT token)
Frontend (React)
    ↓ (View in pgAdmin)
pgAdmin
```

---

## ✅ Quick Checklist

Sebelum start:
- [ ] Baca `README_SETUP.md`
- [ ] Follow `SETUP_CHECKLIST.md`
- [ ] PostgreSQL installed & running
- [ ] pgAdmin installed
- [ ] Node.js v14+ installed
- [ ] Run `npm run setup-all` di backend folder
- [ ] Buka pgAdmin, connect ke database
- [ ] Run `npm start` di backend
- [ ] Run `npm start` di login-dashboard

---

## 📚 Reference Files

- [README_SETUP.md](../README_SETUP.md) - Quick start
- [SETUP_CHECKLIST.md](../SETUP_CHECKLIST.md) - Detailed checklist
- [PGADMIN_SETUP.md](../PGADMIN_SETUP.md) - pgAdmin setup
- [FILES_GUIDE.md](../FILES_GUIDE.md) - File descriptions
- [DATABASE_SETUP.md](../DATABASE_SETUP.md) - Database info

---

## 🎯 Next Step

Mulai dari sini:
1. Baca **[README_SETUP.md](../README_SETUP.md)**
2. Follow **[SETUP_CHECKLIST.md](../SETUP_CHECKLIST.md)**
3. Run setup script
4. Lihat data di pgAdmin

**Total waktu: 15 menit!** ⏱️
