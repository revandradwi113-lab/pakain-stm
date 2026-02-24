# 🎯 Checklist Setup PostgreSQL + pgAdmin

## 📋 Data Struktur
Workspace Anda memiliki:
```
c:\pakain stm\
├── backend/          (Node.js + Database)
├── login-dashboard/  (React Frontend)
├── PGADMIN_SETUP.md  (Dokumentasi)
└── DATABASE_SETUP.md (Setup awal)
```

---

## ✅ CHECKLIST SETUP

### Tahap 1: Persiapan
- [ ] PostgreSQL sudah terinstall di komputer
- [ ] PostgreSQL **running** (Windows Services atau command line)
- [ ] pgAdmin sudah terinstall
- [ ] Terminal/Command Prompt sudah buka di folder `c:\pakain stm\backend`

### Tahap 2: Setup Otomatis Database
**Pilih SATU dari opsi berikut:**

#### ✅ **OPSI 1: Double-Click Script (Paling Mudah - Windows)**
1. Buka folder `c:\pakain stm\backend`
2. Double-click file **`setup-and-seed.bat`**
3. Tunggu sampai selesai dan simpan hasil output
4. Harus melihat:
   ```
   ✅ Tabel users berhasil dibuat
   ✅ Tabel categories berhasil dibuat
   ✅ Tabel products berhasil dibuat
   ✅ Tabel transactions berhasil dibuat
   ✅ Tabel transaction_items berhasil dibuat
   ✅ Categories berhasil ditambahkan
   ✅ Products berhasil ditambahkan
   ```

#### ✅ **OPSI 2: NPM Commands (Recommended - Semua OS)**
Buka terminal di `c:\pakain stm\backend` dan jalankan:
```bash
npm run setup-all
```

Atau jalankan satu per satu:
```bash
npm run setup-db   # Setup tabel
npm run seed-db    # Isi contoh data
```

#### ✅ **OPSI 3: Manual Commands**
```bash
node src/setup-db.js   # Setup database
node src/seed-data.js  # Isi data
```

### Tahap 3: Verifikasi Database di Command Line (Optional)
```bash
# Test koneksi database (jika ada file test-db.js)
npm run test-db
```

### Tahap 4: Setup pgAdmin
- [ ] Buka pgAdmin (Desktop atau browser)
- [ ] Klik **Servers** → **Register → Server**
- [ ] Isi dengan:
  - **Name:** `Toko Online`
  - **Host:** `localhost`
  - **Port:** `5432`
  - **Username:** `postgres`
  - **Password:** `postgres`
  - **Save password:** ✓

### Tahap 5: Lihat Data di pgAdmin
- [ ] Di sidebar pgAdmin, expand: **Servers → Toko Online → Databases → toko_online → Schemas → public → Tables**
- [ ] Lihat tabel-tabel:
  - [ ] ✅ `users` (empty awalnya, akan terisi saat registration)
  - [ ] ✅ `categories` (sudah ada 4 kategori)
  - [ ] ✅ `products` (sudah ada 6 produk)
  - [ ] ✅ `transactions` (empty awalnya)
  - [ ] ✅ `transaction_items` (empty awalnya)

### Tahap 6: Lihat Data di pgAdmin (Query)
- [ ] Klik kanan **toko_online → Query Tool**
- [ ] Copy-paste query untuk verify:

**Lihat categories:**
```sql
SELECT * FROM categories;
```
Harus melihat 4 baris:
- Atasan
- Bawahan
- Outer
- Dress

**Lihat products:**
```sql
SELECT * FROM products;
```
Harus melihat 6 baris dengan harga, stock, dll.

**Lihat users:**
```sql
SELECT id, name, email, role FROM users;
```

---

## 🚀 Tahap 7: Jalankan Aplikasi

### Terminal 1 - Backend
```bash
cd backend
npm start
```
✅ Harus melihat:
```
🚀 Server running on port 5000
```

### Terminal 2 - Frontend
```bash
cd login-dashboard
npm install  # jika belum, atau npm start saja
npm start
```
✅ Harus buka browser http://localhost:3001

---

## 🧪 Tahap 8: Test Register User

1. Buka http://localhost:3001
2. Klik **Register**
3. Isi form dengan data baru:
   - **Name:** `Nama Anda`
   - **Email:** `email@example.com`
   - **Password:** `password123`
4. Klik **Register**
5. Buka pgAdmin → Query Tool
6. Jalankan:
   ```sql
   SELECT * FROM users;
   ```
   ✅ Harus melihat user baru yang Anda buat!

---

## 🔧 Environment Configuration

File: `c:\pakain stm\backend\.env` (buat jika belum ada)
```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=toko_online
PGPASSWORD=postgres
PGPORT=5432
PORT=5000
```

---

## ✨ Output yang Diharapkan

### Backend Console
```
✅ Tabel users berhasil dibuat
✅ Tabel categories berhasil dibuat
✅ Tabel products berhasil dibuat
✅ Tabel transactions berhasil dibuat
✅ Tabel transaction_items berhasil dibuat
✅ Index email berhasil dibuat
✅ Categories berhasil ditambahkan
✅ Products berhasil ditambahkan
```

### pgAdmin
```
Servers
└─ Toko Online
   └─ Databases
      └─ toko_online
         └─ Schemas
            └─ public
               ├─ Tables
               │  ├─ categories ✓
               │  ├─ products ✓
               │  ├─ transaction_items ✓
               │  ├─ transactions ✓
               │  └─ users ✓
               └─ Indexes
                  └─ idx_users_email ✓
```

---

## 🆘 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **error: database "toko_online" does not exist** | Jalankan `npm run setup-db` |
| **error: ECONNREFUSED localhost:5432** | Pastikan PostgreSQL sudah running |
| **pgAdmin tidak bisa connect** | Cek username/password di connection settings |
| **Table sudah ada, tidak bisa create** | Itu NORMAL! Script gunakan `CREATE TABLE IF NOT EXISTS` |
| **Data tidak muncul di pgAdmin** | Refresh browser pgAdmin atau jalankan `npm run seed-db` |

---

## ✅ Selesai!

Jika semua checklist di atas sudah done ✓, Anda sudah bisa:
- ✔️ Lihat database structure di pgAdmin
- ✔️ Lihat test data (categories, products)
- ✔️ Register user baru dan lihat di pgAdmin
- ✔️ Login dengan email yang sudah register

**Tanpa mengubah kode yang sudah benar!** 🎉
