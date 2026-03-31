/**
 * Login Component
 * Menampilkan form login untuk user/admin
 * Validasi: email format dan password minimal 6 karakter
 * Fitur: Login, navigasi ke Register
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import apiService from './services/apiService';

/**
 * Login - Komponen form login
 * @returns {JSX.Element} Form login dengan validasi dan error handling
 */
function Login() {
  const navigate = useNavigate();
  // State untuk email input
  const [email, setEmail] = useState('');
  // State untuk password input
  const [password, setPassword] = useState('');
  // State untuk error message
  const [error, setError] = useState('');
  // State untuk loading state saat submit
  const [loading, setLoading] = useState(false);

  /**
   * handleSubmit - Menangani form submission untuk login
   * Melakukan validasi input sebelum mengirim ke backend
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi: Email dan password tidak boleh kosong
    if (!email || !password) {
      setError('Email dan password harus diisi');
      setLoading(false);
      return;
    }

    // Validasi: Format email harus valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email tidak valid');
      setLoading(false);
      return;
    }

    // Validasi: Password minimal 6 karakter
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    try {
      // Kirim login request ke backend
      const response = await apiService.login(email, password);
      
      // Simpan token autentikasi (access token dan refresh token)
      apiService.setToken(response.token, response.refreshToken);
      
      // Simpan informasi user di localStorage untuk referensi UI
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect ke halaman dashboard setelah login berhasil
      navigate('/dashboard');
    } catch (err) {
      // Tampilkan error message jika login gagal
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>👕 Revandra Shop </h1>
          <p>Toko Pakaian Online</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password Anda"
            />
          </div>

          {/* Tampilkan error message jika ada validasi yang gagal */}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Sedang masuk...' : 'Masuk'}
          </button>
        </form>

        <div className="login-footer">
          <p>Gunakan email Anda untuk login</p>
          <p>Belum punya akun? <button onClick={() => navigate('/register')} className="link-btn">Daftar di sini</button></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
