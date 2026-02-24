# 📊 Setup pgAdmin untuk Melihat Database

## ✅ Persyaratan
- PostgreSQL sudah terinstall dan running
- pgAdmin sudah terinstall (atau menggunakan versi online)

---

## 🚀 Langkah-Langkah Setup

### 1️⃣ Jalankan Setup Database & Seed Data

Buka terminal di folder `backend` dan jalankan kedua script berikut:

```bash
cd backend
```

**Jalankan setup database (jika belum):**
```bash
node src/setup-db.js
```

Anda akan melihat output seperti:
```
✅ Tabel users berhasil dibuat
✅ Tabel categories berhasil dibuat
✅ Tabel products berhasil dibuat
✅ Tabel transactions berhasil dibuat
✅ Tabel transaction_items berhasil dibuat
```

**Jalankan seed data (isi contoh data):**
```bash
node src/seed-data.js
```

Anda akan melihat output seperti:
```
✅ Categories berhasil ditambahkan
✅ Products berhasil ditambahkan
```

---

### 2️⃣ Buka pgAdmin dan Hubungkan ke Database

**Pilih salah satu:**

#### **Option A: pgAdmin Desktop (Recommended)**
1. Buka aplikasi pgAdmin 4
2. Di sidebar kanan, klik **Servers** → klik kanan → **Register** → **Server**

#### **Option B: pgAdmin Online**
1. Buka https://www.pgadmin.org/download/
2. Atau gunakan Docker: `docker run -p 5050:80 dpage/pgadmin4`

---

### 3️⃣ Konfigurasi Koneksi ke PostgreSQL

Di pgAdmin, isi formulir dengan:

| Field | Value |
|-------|-------|
| **Name** | `Toko Online` (atau nama apapun) |
| **Hostname/Address** | `localhost` |
| **Port** | `5432` |
| **Database** | (kosongkan untuk sekarang) |
| **Username** | `postgres` |
| **Password** | `postgres` |
| **Save Password?** | ✓ Yes |

Kemudian klik **Save**.

---

### 4️⃣ Lihat Database di pgAdmin

Setelah connect, di sidebar pgAdmin:

```
Servers
  └─ Toko Online
     └─ Databases
        └─ toko_online
           ├─ Schemas
           │  └─ public
           │     ├─ Tables
           │     │  ├─ users (lihat data register login)
           │     │  ├─ categories (Atasan, Bawahan, dll)
           │     │  ├─ products (T-Shirt, Jeans, dll)
           │     │  ├─ transactions (riwayat transaksi)
           │     │  └─ transaction_items
           │     ├─ Indexes
           │     └─ Foreign Keys
```

---

### 5️⃣ Query Data di pgAdmin

Klik kanan pada **Database `toko_online`** → **Query Tool**

Atau klik tabel tertentu → **View/Edit Data** → **All Rows**

**Contoh query untuk lihat semua data:**

```sql
-- Lihat semua user yang register
SELECT * FROM users;

-- Lihat semua kategori
SELECT * FROM categories;

-- Lihat semua produk dengan kategorinya
SELECT p.*, c.name as category_name 
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Lihat semua transaksi
SELECT * FROM transactions;
```

---

## 🔐 Kredensial Database

Jika Anda perlu mengubah kredensial, edit file:
📄 **[backend/.env](backend/.env)** atau buat `.env` baru:

```env
PGUSER=postgres
PGHOST=localhost
PGDATABASE=toko_online
PGPASSWORD=postgres
PGPORT=5432
```

---

## ✨ Data yang Akan Tampil

### Users (dari register di frontend)
```
id | name           | email              | password        | role     | is_active | created_at
1  | Test User      | test@example.com   | [hashed]        | customer | true      | 2024-01-15
2  | Admin Toko     | admin@toko.com     | [hashed]        | admin    | true      | 2024-01-15
```

### Categories (sudah ada)
```
id | name    | description
1  | Atasan  | Pakaian bagian atas seperti kaos, kemeja
2  | Bawahan | Pakaian bagian bawah seperti celana, rok
3  | Outer   | Pakaian luar seperti jaket, cardigan
4  | Dress   | Gaun dan dress untuk wanita
```

### Products (sudah ada)
```
id | name             | price  | stock | category_id
1  | T-Shirt Premium  | 150000 | 50    | 1
2  | Jeans Casual     | 350000 | 30    | 2
3  | Kemeja Formal    | 280000 | 25    | 1
... (6 produk total)
```

---

## 🆘 Troubleshooting

### PostgreSQL tidak bisa connect
```bash
# Restart PostgreSQL
# Windows: Services → PostgreSQL → Restart
# Linux: sudo service postgresql restart
# Mac: brew services restart postgresql
```

### Error: Database "toko_online" tidak ada
```bash
node src/setup-db.js
```

### Tidak ada data di tabel
```bash
node src/seed-data.js
```

### Port 5432 sudah terpakai
- Ganti port di `backend/.env`
- Update di pgAdmin connection settings

---

## 📋 Checklist Setup

- [ ] PostgreSQL running
- [ ] `node src/setup-db.js` berhasil
- [ ] `node src/seed-data.js` berhasil
- [ ] pgAdmin connect berhasil
- [ ] Bisa lihat tabel `users`, `categories`, `products` di pgAdmin
- [ ] Bisa lihat data dengan Query Tool pgAdmin

---

## 🎯 Next Steps

1. **Backend running:**
   ```bash
   cd backend
   npm install  # Jika belum
   npm start
   ```

2. **Frontend running:**
   ```bash
   cd login-dashboard
   npm install  # Jika belum
   npm start
   ```

3. **Register user baru di frontend** → Data akan langsung muncul di pgAdmin

4. **Monitoring real-time** di pgAdmin dengan refresh

---

**✅ Sudah siap melihat hasil di pgAdmin tanpa mengubah kode yang sudah benar!**
