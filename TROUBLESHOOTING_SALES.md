# 🔧 Troubleshooting Data Penjualan Kosong

## 📋 Langkah-Langkah Debug

### 1️⃣ **Backup current progress dan restart backend**
```bash
# Restart backend server
cd c:\pakain stm\backend
node src/server.js
```

### 2️⃣ **Verify data di database**
```bash
cd c:\pakain stm\backend
node src/verify-db-data.js
```

Lihat output dan pastikan:
- ✅ Ada transactions di database (bukan kosong)
- ✅ Ada transaction_items terkait
- ✅ Admin user exist dengan role 'admin'
- ✅ Stock produk berkurang

### 3️⃣ **Check browser console (F12) saat akses tab Penjualan**
Buka: `Ctrl + Shift + I` → Console tab

Lihat pesan debug:
- `📊 Fetching sales data for admin...` - Mulai fetch
- `✅ Transactions data received:` - Data transaksi diterima
- `Found X transactions` - Jumlah transaksi
- `❌ Error fetching sales data:` - Jika ada error

### 4️⃣ **Pastikan user yang login adalah ADMIN**

Debug Info di tab Penjualan akan menampilkan:
```
Debug Info - Role: admin | Sales Count: X
```

Jika Role bukan `admin`, maka:
- Logout
- Update user di database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```
- Login kembali

## 🆘 Jika Masih Kosong

### ❌ Kemungkinan Masalah 1: Tidak ada data transaksi
```bash
# Cek dengan query manual
SELECT id, user_id, total FROM transactions;
```
Jika kosong, berarti checkout belum berhasil disimpan.

### ❌ Kemungkinan Masalah 2: Role user bukan admin
```bash
SELECT email, role FROM users;
```
Pastikan ada user dengan role = 'admin'

### ❌ Kemungkinan Masalah 3: API Error 403
Jika console menunjukkan error, berarti user tidak punya akses (bukan admin).

## ✅ Workaround: Manual Insert Testing Data

Jika ingin test dengan data dummy:
```sql
-- 1. Pastikan ada admin user
INSERT INTO users (name, email, password, role, is_active) 
VALUES ('Admin Test', 'admin@test.com', '$2a$10$xxx', 'admin', true);

-- 2. Insert dummy transaction
INSERT INTO transactions (user_id, total) 
VALUES (1, 250000);

-- 3. Insert dummy items (ganti product_id dengan yang ada)
INSERT INTO transaction_items (transaction_id, product_id, quantity, subtotal) 
VALUES (1, 1, 2, 150000);
```

## 📝 Checklist Sebelum Finalize

- [ ] Backend running di port 5000
- [ ] Login sebagai admin
- [ ] Tab "Data Penjualan" muncul
- [ ] Console F12 tidak menunjukkan error
- [ ] `verify-db-data.js` menunjukkan data ada
- [ ] Data penjualan muncul di tabel

## 🎯 Next Steps

1. Jalankan `verify-db-data.js` dan share output
2. Buka browser console (F12) di tab "Data Penjualan"
3. Share screenshot console output
4. Lalu saya bisa fix masalahnya dengan pasti
