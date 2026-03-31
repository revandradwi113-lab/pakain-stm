/**
 * App Component - Main Application Router
 * Mengatur routing untuk seluruh aplikasi dengan React Router
 * Routes: Login, Register, Dashboard, dan Products
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Products from "./Products";

/**
 * App - Komponen utama yang mengatur seluruh routing aplikasi
 * @returns {JSX.Element} BrowserRouter dengan route definitions
 */
function App() {
  return (
    <BrowserRouter>
      {/* Routes untuk berbagai halaman aplikasi */}
      <Routes>
        {/* Halaman Login (root path) */}
        <Route path="/" element={<Login />} />
        {/* Halaman Register untuk membuat akun baru */}
        <Route path="/register" element={<Register />} />
        {/* Halaman Dashboard (setelah login) */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Halaman Produk (menampilkan daftar produk) */}
        <Route path="/products" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;