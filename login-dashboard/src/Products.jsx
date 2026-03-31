/**
 * Products Component
 * Menampilkan daftar produk dalam bentuk grid
 * Fitur: Fetch data dari backend, filter produk, kembali ke dashboard
 * Auth: Memastikan user sudah login sebelum mengakses halaman
 */

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Products.css";
import apiService from "./services/apiService";

/**
 * Products - Komponen untuk menampilkan daftar produk
 * Membaca data produk dari API backend saat component mount
 * @returns {JSX.Element} Grid produk atau loading/error state
 */
function Products() {
  // State untuk menyimpan data produk yang diambil dari backend
  const [products, setProducts] = useState([]);
  // State untuk loading indicator
  const [loading, setLoading] = useState(true);
  // State untuk error message
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * useEffect Hook - Fetch data produk saat component mount
   * Validasi auth token sebelum fetch, redirect ke login jika tidak ada token
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Ambil token dari localStorage untuk autentikasi
        const token = apiService.getToken();
        // Jika tidak ada token, redirect ke halaman login
        if (!token) {
          navigate("/");
          return;
        }

        // Fetch data produk dari backend API
        const data = await apiService.getProducts();
        // Set produk, pastikan data adalah array
        setProducts(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        // Log error dan tampilkan error message ke user
        console.error("Error fetching products:", err);
        setError(err.message || "Gagal mengambil data produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  /**
   * handleBack - Navigasi kembali ke halaman dashboard
   */
  const handleBack = () => {
    navigate("/dashboard");
  };

  // Tampilkan loading state saat data sedang diambil
  if (loading) {
    return (
      <div className="products-container">
        <p>Memuat produk...</p>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Daftar Produk</h1>
        <button onClick={handleBack} className="btn-back">
          Kembali ke Dashboard
        </button>
      </div>

      {/* Tampilkan error message jika ada error saat fetch */}
      {error && <div className="error-message">{error}</div>}

      {/* Tampilkan pesan jika produk kosong */}
      {products.length === 0 ? (
        <p className="no-products">Tidak ada produk tersedia</p>
      ) : (
        // Grid produk - menampilkan setiap produk dalam card
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p className="category">Kategori: {product.category_id || "-"}</p>
              <p className="price">Rp {product.price?.toLocaleString("id-ID")}</p>
              <p className="stock">
                Stok: <strong>{product.stock}</strong>
              </p>
              {/* Tampilkan deskripsi jika ada */}
              {product.description && (
                <p className="description">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
