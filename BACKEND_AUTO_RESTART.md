# 🚀 Backend Server - Auto-Restart Configuration

Backend ini sekarang sudah dilengkapi dengan fitur **auto-restart** ketika crash atau error.

---

## 📋 Cara Menjalankan Backend

### **Opsi 1: Menggunakan PowerShell Script** ⭐ (Recommended)

1. Buka **PowerShell** di folder workspace
2. Ketik command:
```powershell
.\start-backend.ps1
```

**Fitur:**
- ✅ Auto-restart jika backend crash
- ✅ Monitoring process
- ✅ Detailed logging dengan timestamp
- ✅ Max 10 restart attempts (bisa dikonfigurasi)

**Parameters (optional):**
```powershell
.\start-backend.ps1 -MaxRestarts 15 -RestartDelay 2 -MaxMemory 500
```

---

### **Opsi 2: Menggunakan Batch File**

1. Double-click file `start-backend.bat`
2. Window akan terbuka dan backend akan auto-restart jika crash

**Fitur:**
- ✅ Simple dan mudah
- ✅ Auto-restart otomatis
- ✅ Progress indicator

---

### **Opsi 3: Manual dengan npm**

```bash
cd backend
npm start
```

**Note:** Backend tidak akan auto-restart dengan cara ini.

---

## 🔄 Apa yang Terjadi Jika Backend Crash?

1. Backend akan **stop**
2. System akan **wait 3 detik**
3. Backend akan **automatically restart**
4. Proses berjalan lagi
5. Jika crash lagi, step 1-4 berulang (max 10x)

---

## 📊 Log Output

Setiap kali backend start/restart, Anda akan melihat:

```
✅ Starting backend server...
🕐 Process started at: Sat 03/28/2026 10:35:45
⏳ [STARTUP] Loading dependencies...
✅ [STARTUP] Dependencies loaded
⏳ [STARTUP] Loading environment variables...
✅ [STARTUP] Environment variables loaded
...
📝 [DOCS] Swagger API docs available at http://localhost:5000/api-docs
✨ Backend siap melayani requests!
```

---

## 🛠️ Troubleshooting

### Backend masih sering crash?

1. **Check error messages** di console output
2. **Verify database connection:**
   ```
   ✅ [DB] Database connected successfully
   ```
3. **Check port 5000** tidak digunakan program lain:
   ```powershell
   netstat -ano | findstr :5000
   ```

### Port 5000 sudah digunakan?
```powershell
# Kill process yang menggunakan port 5000
Get-Process | Where-Object { $_.Handles -like "*5000*" } | Stop-Process -Force
```

---

## 📌 Opsi Lanjutan: Menggunakan PM2 (Node Process Manager)

Jika ingin production-grade process management:

```bash
# Install PM2 globally
npm install -g pm2

# Start backend dengan PM2
pm2 start ecosystem.config.js

# Monitor processes
pm2 monit

# View logs
pm2 logs toko-pakaian-backend

# Stop
pm2 stop toko-pakaian-backend

# Restart
pm2 restart toko-pakaian-backend
```

---

## ✅ Testing Backend Stability

1. Start backend menggunakan `start-backend.ps1`
2. Di terminal lain, coba crash backend:
   ```bash
   cd backend
   node -e "process.exit(1)"
   ```
3. Lihat backend otomatis restart

---

## 📝 Notes

- Backend sekarang memiliki proper error handling
- Unhandled errors akan di-log dengan detail
- Database connection error akan dideteksi
- Server graceful shutdown when needed
- Max memory usage: 300MB (bisa konfigurasi)

**Backend Anda sekarang jauh lebih STABLE!** 🎉
