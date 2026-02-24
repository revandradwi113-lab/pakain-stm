# 🚀 QUICK START - PostgreSQL + pgAdmin Setup

## 📍 Anda Berada Di Sini

Workspace: `c:\pakain stm\`

Folder structure:
- ✅ `backend/` - API Server (Node.js)
- ✅ `login-dashboard/` - Frontend (React)
- 📄 `SETUP_CHECKLIST.md` - **BACA INI DULU** untuk step-by-step
- 📄 `PGADMIN_SETUP.md` - Dokumentasi detail pgAdmin

---

## ⚡ QUICK SETUP (3 LANGKAH)

### Langkah 1: Setup Database (2 Pilihan)

**A. Windows - Double Click:**
```
c:\pakain stm\backend\setup-and-seed.bat
```

**B. Semua OS - NPM Command:**
```bash
cd backend
npm run setup-all
```

Output harus ada:
```
✅ Tabel users berhasil dibuat
✅ Categories berhasil ditambahkan
✅ Products berhasil ditambahkan
```

### Langkah 2: Buka pgAdmin & Connect

1. Buka pgAdmin
2. Register Server baru:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Username:** `postgres`
   - **Password:** `postgres`

3. Ekspand: **Servers → Database → toko_online → Tables**
   - Lihat `categories`, `products`, `users`, dll

### Langkah 3: Jalankan Aplikasi

**Terminal 1:**
```bash
cd backend && npm start
```

**Terminal 2:**
```bash
cd login-dashboard && npm start
```

Browser akan buka http://localhost:3001

---

## ✨ Apa yang Siap Dilihat di pgAdmin

### Tables yang Sudah Ada:
- **categories** - 4 kategori pakaian
- **products** - 6 produk contoh dengan harga & stock
- **users** - User yang register via frontend
- **transactions** - Riwayat transaksi

### Contoh Query di pgAdmin:
```sql
-- Lihat semua produk
SELECT * FROM products;

-- Lihat user yang sudah register
SELECT id, name, email, role FROM users;

-- Lihat categories
SELECT * FROM categories;
```

---

## 📚 Dokumentasi Lengkap

Lihat file-file ini untuk detail:

| File | Untuk |
|------|-------|
| [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) | **Step-by-step checklist** (baca dulu!) |
| [PGADMIN_SETUP.md](PGADMIN_SETUP.md) | Detail cara setup pgAdmin & query data |
| [DATABASE_SETUP.md](DATABASE_SETUP.md) | Info database structure awal |
| [backend/package.json](backend/package.json) | NPM scripts yang tersedia |

---

## 🎯 Cara Lihat Data di pgAdmin

### Komandan Paling Sederhana:

1. **Setup database (sekali saja):**
   ```bash
   cd backend
   npm run setup-all
   ```

2. **Buka pgAdmin → Server → toko_online → Tables**

3. **Klik kanan tabel → View/Edit Data → All Rows**

4. **Atau Query Tool:**
   - Klik kanan `toko_online` → Query Tool
   - Paste: `SELECT * FROM categories;`
   - Tekan Ctrl+Enter

---

## ✅ Pre-requisites Checklist

Sebelum mulai, pastikan:
- [ ] PostgreSQL installed & running
- [ ] pgAdmin installed
- [ ] Node.js installed (v14+)
- [ ] Terminal/CMD sudah buka di folder ini

---

## 🆘 Bantuan Cepat

**Q: Mana yang harus dijalankan dulu?**
A: Setup database dengan `npm run setup-all`, baru jalankan `npm start`

**Q: Bagaimana lihat datanya?**
A: Buka pgAdmin → klik tabel → View Data

**Q: Data saya tidak muncul?**
A: Jalankan `npm run seed-db` untuk isi contoh data

**Q: Saya mengubah kode dan ingin reset database?**
A: Hapus database `toko_online`, jalankan `npm run setup-db` lagi

---

## 📖 Next: Read [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)

Itu adalah panduan lengkap step-by-step yang akan memandu Anda dari A sampai Z.

**Selamat setup! 🎉**
