// 1️⃣ Import library utama Express
console.log('⏳ [STARTUP] Loading dependencies...');
const express = require("express");  
const app = express();
const cors = require("cors");
const pool = require("./db/pool");
console.log('✅ [STARTUP] Dependencies loaded');

// 2️⃣ Import file konfigurasi environment (.env)
console.log('⏳ [STARTUP] Loading environment variables...');
require("dotenv").config({ quiet: true });
console.log('✅ [STARTUP] Environment variables loaded');

// 3️⃣ Tentukan port server dari file .env (default ke 5000 jika tidak ada)
const port = process.env.PORT || 5000;

// 4️⃣ Middleware bawaan Express untuk parsing JSON dan CORS
console.log('⏳ [STARTUP] Setting up middleware...');
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());
// Serve static files from public folder
app.use('/uploads', express.static('public/uploads'));
console.log('✅ [STARTUP] Middleware configured');

// 5️⃣ Import semua route (rute API)
console.log('⏳ [STARTUP] Loading API routes...');
const authRoutes = require("./routes/auth");            // 🔐 Untuk login, register, logout, refresh-token
const categoryRoutes = require("./routes/categories");  // 📂 Untuk CRUD kategori pakaian
const productRoutes = require("./routes/products");     // 👕 Untuk CRUD produk pakaian
const transactionRoutes = require("./routes/transactions"); // 💳 Untuk transaksi penjualan
const userRoutes = require("./routes/users");           // 👤 Untuk manajemen user (profile, deactivate, dll)
console.log('✅ [STARTUP] API routes loaded');

// 6️⃣ Gunakan route dengan prefix URL masing-masing
console.log('⏳ [STARTUP] Registering route handlers...');
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/transactions", transactionRoutes);
app.use("/users", userRoutes);
console.log('✅ [STARTUP] Route handlers registered');

// 7️⃣ Endpoint dasar (untuk mengetes server)
app.get("/", (req, res) => {
  res.send("🛍️ API Toko Pakaian berjalan dengan baik!");
});

// Aktifkan Swagger
console.log('⏳ [STARTUP] Loading Swagger documentation...');
const swaggerDocs = require("./swagger"); // Import file swagger
swaggerDocs(app); // Jalankan Swagger
console.log('✅ [STARTUP] Swagger documentation loaded');


// 8️⃣ Test database connection
console.log('⏳ [STARTUP] Testing database connection...');
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ [DB] Database connection failed:', err.message);
    process.exit(1);
  } else {
    console.log('✅ [DB] Database connected successfully');
  }
});

// 8️⃣ Jalankan server
const server = app.listen(port, () => {
  console.log(`🚀 [SERVER] Server running on port ${port}`);
  console.log(`📝 [DOCS] Swagger API docs available at http://localhost:${port}/api-docs`);
  console.log('\n✨ Backend siap melayani requests!\n');
});

// ============================================================
// ERROR HANDLING & GRACEFUL SHUTDOWN
// ============================================================

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ [UNHANDLED] Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ [UNCAUGHT] Uncaught Exception:', error.message);
  console.error(error.stack);
  // Restart process after 3 seconds
  setTimeout(() => {
    console.log('🔄 [RESTART] Restarting process...');
    process.exit(1);
  }, 3000);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ [PORT] Port ${port} is already in use`);
  } else {
    console.error('❌ [SERVER] Server error:', error.message);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⏸️  [SHUTDOWN] SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ [SHUTDOWN] Server closed');
    pool.end(() => {
      console.log('✅ [SHUTDOWN] Database connection closed');
      process.exit(0);
    });
  });
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ [SHUTDOWN] Forced shutdown');
    process.exit(1);
  }, 10000);
});

process.on('SIGINT', () => {
  console.log('\n⏸️  [SHUTDOWN] SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ [SHUTDOWN] Server closed');
    pool.end(() => {
      console.log('✅ [SHUTDOWN] Database connection closed');
      process.exit(0);
    });
  });
});
