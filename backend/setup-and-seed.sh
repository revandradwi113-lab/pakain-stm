#!/bin/bash

# Script otomatis untuk setup database dan seed data
# Jalankan dari folder backend: bash setup-and-seed.sh

echo "==================================="
echo "📊 Setup Database & Seed Data"
echo "==================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Menginstall dependencies..."
    npm install
    echo ""
fi

# Run setup database
echo "🔧 1️⃣ Menjalankan setup database..."
echo ""
node src/setup-db.js
echo ""

# Run seed data
echo "🌱 2️⃣ Menjalankan seed data..."
echo ""
node src/seed-data.js
echo ""

echo "==================================="
echo "✅ Setup Selesai!"
echo "==================================="
echo ""
echo "Langkah selanjutnya:"
echo "1. Buka pgAdmin"
echo "2. Connect ke: localhost:5432"
echo "3. Username: postgres"
echo "4. Password: postgres"
echo "5. Database: toko_online"
echo ""
echo "Untuk menjalankan server:"
echo "  npm start"
echo ""
