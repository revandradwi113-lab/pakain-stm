// 1️⃣ Import library utama Express
const express = require("express");  
const app = express();
const cors = require("cors");

// 2️⃣ Import file konfigurasi environment (.env)
require("dotenv").config({ quiet: true });


// 3️⃣ Tentukan port server dari file .env (default ke 5000 jika tidak ada)
const port = process.env.PORT || 5000;

// 4️⃣ Middleware bawaan Express untuk parsing JSON dan CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());

// 5️⃣ Import semua route (rute API)
const authRoutes = require("./routes/auth");            // 🔐 Untuk login, register, logout, refresh-token
const categoryRoutes = require("./routes/categories");  // 📂 Untuk CRUD kategori pakaian
const productRoutes = require("./routes/products");     // 👕 Untuk CRUD produk pakaian
const transactionRoutes = require("./routes/transactions"); // 💳 Untuk transaksi penjualan
const userRoutes = require("./routes/users");           // 👤 Untuk manajemen user (profile, deactivate, dll)

// 6️⃣ Gunakan route dengan prefix URL masing-masing
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);

// 7️⃣ Endpoint dasar (untuk mengetes server)
app.get("/", (req, res) => {
  res.send("🛍️ API Toko Pakaian berjalan dengan baik!");
});

// Aktifkan Swagger
const swaggerDocs = require("./swagger"); // Import file swagger
swaggerDocs(app); // Jalankan Swagger


// 8️⃣ Jalankan server
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
