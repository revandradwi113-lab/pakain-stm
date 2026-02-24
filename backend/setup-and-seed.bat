@echo off
REM Script otomatis untuk setup database dan seed data
REM Jalankan file ini dari folder backend

echo ===================================
echo 📊 Setup Database & Seed Data
echo ===================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Menginstall dependencies...
    call npm install
    echo.
)

REM Run setup database
echo 🔧 1️⃣ Menjalankan setup database...
echo.
call node src/setup-db.js
echo.

REM Run seed data
echo 🌱 2️⃣ Menjalankan seed data...
echo.
call node src/seed-data.js
echo.

echo ===================================
echo ✅ Setup Selesai!
echo ===================================
echo.
echo Langkah selanjutnya:
echo 1. Buka pgAdmin
echo 2. Connect ke: localhost:5432
echo 3. Username: postgres
echo 4. Password: postgres
echo 5. Database: toko_online
echo.
echo Untuk menjalankan server:
echo   npm start
echo.
pause
