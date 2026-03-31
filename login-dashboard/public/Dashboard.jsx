/**
 * Dashboard Component
 * Menampilkan halaman dashboard admin dengan menu navigasi
 * Fitur: Tombol Lihat Produk, Tambah Produk, dan Logout
 */

import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

/**
 * Dashboard - Komponen untuk menampilkan halaman dashboard
 * @returns {JSX.Element} Halaman dashboard dengan welcome message dan navigation buttons
 */
function Dashboard() {
  // Inisialisasi hook useNavigate untuk navigasi antar halaman
  const navigate = useNavigate();

  /**
   * handleLogout - Menangani proses logout dan navigasi ke halaman login
   */
  const handleLogout = () => {
    navigate("/");
  };

  /**
   * handleViewProducts - Menangani navigasi ke halaman produk
   */
  const handleViewProducts = () => {
    navigate("/products");
  };

  /**
   * handleAddProduct - Menangani navigasi ke halaman tambah produk baru
   */
  const handleAddProduct = () => {
    navigate("/add-product");
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Selamat datang, Admin </p>
      <div className="dashboard-buttons">
        <button onClick={handleAddProduct} className="btn-add-product">Tambah Produk</button>
        <button onClick={handleViewProducts} className="btn-primary">Lihat Produk</button>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;