# 🔧 DEBUG GUIDE - Data Penjualan Kosong

## Saya sudah menambah COMPREHENSIVE LOGGING di:
1. ✅ Frontend checkout handler
2. ✅ Frontend fetch sales data function
3. ✅ API service getTransactions
4. ✅ API service getTransactionDetail

## 📋 STEP BY STEP DEBUG

### 1️⃣ Restart Everything

```bash
# Terminal 1 - Backend
cd c:\pakain stm\backend
node src/server.js

# Terminal 2 - Frontend (wait backend ready)
cd c:\pakain stm\login-dashboard
npm start
```

Tunggu sampai kedua berjalan normal.

### 2️⃣ Buka Browser & Login sebagai ADMIN

- Buka http://localhost:3000
- Login dengan admin user
- Pastikan di tab "Produk" dan checkout berhasil

### 3️⃣ Buka Developer Console (F12)

- Tekan `Ctrl + Shift + I` atau `F12`
- Pilih tab "Console"
- **Jangan tutup Console!** (biarkan terbuka)

### 4️⃣ Lakukan Checkout & Observe Console

1. **Tambah produk ke keranjang** (lihat di Console untuk logs)
   
   Anda akan lihat logs seperti:
   ```
   🛒 [Checkout] Starting...
   🛒 [Checkout] Cart items: [...]
   🛒 [Checkout] Formatted items: [...]
   🛒 [Checkout] Total price: XXXXX
   🛒 [Checkout] Calling createTransaction...
   ```

2. **Klik Checkout** (lihat Console terus)

   Anda akan lihat:
   ```
   🛒 [Checkout] Response: {transaction_id: X}
   ✅ [Checkout] Checkout success! Transaction ID: X
   🛒 [Checkout] Refreshing products...
   ✅ [Checkout] Products refreshed
   🛒 [Checkout] Refreshing sales data...
   📊 [fetchSalesData] Starting...
   📊 [fetchSalesData] User role: admin
   📊 [fetchSalesData] Calling getTransactions()...
   🔄 [getTransactions] Starting...
   🔄 [getTransactions] Token exists? true
   🔄 [getTransactions] Fetching from: http://localhost:5000/transactions
   🔄 [getTransactions] Response status: 200 (atau error)
   ```

### 5️⃣ Share Console Output

**Sesuaikan dengan situasi yang ada:**

#### ✅ Jika melihat:
```
🔄 [getTransactions] Response status: 200
🔄 [getTransactions] Data received: [Array(1)]
📊 [fetchSalesData] Found X transactions
```

Berarti API berhasil tapi data masih tidak tampil. Problem lebih dalam.

#### ❌ Jika melihat:
```
❌ [getTransactions] Error: Akses ditolak!
```

Berarti user tidak admin. Cek:
```javascript
// Buka Console dan ketik:
localStorage.getItem('user')
```

Pastikan ada `"role":"admin"`

#### ❌ Jika melihat:
```
🛒 [Checkout] Response: undefined
❌ [Checkout] No transaction_id in response
```

Berarti checkout gagal. Cek response sebelumnya.

### 6️⃣ Backend Debug

Jalankan script debug:
```bash
# Terminal baru
cd c:\pakain stm\backend
node src/full-debug.js
```

Output akan menunjukkan:
- Jumlah users
- Jumlah products
- Jumlah transactions
- Jumlah transaction items
- Admin users

### 7️⃣ Test Checkout Flow di Backend

```bash
cd c:\pakain stm\backend
node src/test-checkout-flow.js
```

Ini akan:
- Create test kasir user
- Create dummy transaksi
- Verify data tersimpan
- Jalankan seluruh flow

Jika sukses akan melihat:
```
✅ CHECKOUT TEST COMPLETE - Everything looks good!
```

## 🎯 Checklist

Sebelum report, pastikan:

- [ ] Kedua terminal (backend & frontend) running tanpa error
- [ ] Browser menampilkan console tanpa error besar
- [ ] User yang login punya role "admin"
- [ ] Checkout process selesai tanpa error
- [ ] Console menunjukkan logs (tidak blank)
- [ ] Backend test script (`test-checkout-flow.js`) berhasil

## 📸 Apa yang Anda Harus Share

Jika masih kosong, share:

1. **Screenshot Console** (F12) saat checkout
2. **Output dari `node src/full-debug.js`**
3. **Output dari `node src/test-checkout-flow.js`**
4. **Apa exactly yang Anda lakukan saat checkout**

Dengan info ini, saya bisa pinpoint masalahnya dengan pasti!

## 🚀 Expected Flow Jika Semuanya Berjalan Baik

```
1. Login (Admin)
2. Tambah ke keranjang ✓
3. Checkout ✓
4. Alert sukses ✓
5. Console: 📊 [fetchSalesData] Found X transactions ✓
6. Tab Penjualan auto muncul ✓
7. Data penjualan tampil di tabel ✓
```
