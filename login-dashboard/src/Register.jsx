/**
 * Register Component
 * Menampilkan form registrasi untuk membuat akun customer baru
 * Validasi: nama minimal 3 karakter, email format valid, password minimal 6 karakter
 * Fitur: Registrasi, validasi password match, navigasi ke Login
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import apiService from './services/apiService';

/**
 * Register - Komponen form registrasi customer
 * @returns {JSX.Element} Form registrasi dengan validasi lengkap
 */
function Register() {
  const navigate = useNavigate();
  // State untuk form data (name, email, password, confirmPassword)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  // State untuk error message
  const [error, setError] = useState('');
  // State untuk loading state saat submit
  const [loading, setLoading] = useState(false);

  /**
   * handleChange - Menangani perubahan input form
   * Update state formData sesuai dengan input field yang berubah
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  /**
   * handleSubmit - Menangani form submission untuk registrasi
   * Melakukan validasi input sebelum mengirim ke backend
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validasi: Semua field harus diisi
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    // Validasi: Nama minimal 3 karakter
    if (formData.name.length < 3) {
      setError('Nama minimal 3 karakter');
      setLoading(false);
      return;
    }

    // Validasi: Format email harus valid
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Email tidak valid');
      setLoading(false);
      return;
    }

    // Validasi: Password minimal 6 karakter
    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    // Validasi: Password dan confirm password harus sama
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      // Kirim registrasi request ke backend
      await apiService.register(formData.name, formData.email, formData.password);
      
      // Tampilkan alert sukses dan redirect ke login
      alert('Registrasi berhasil! Silakan login dengan email Anda');
      navigate('/');
    } catch (err) {
      // Tampilkan error message jika registrasi gagal
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h1>👕 Revandra Shop </h1>
          <p>Daftar Akun Baru</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nama Lengkap</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password (min 6 karakter)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Konfirmasi password Anda"
            />
          </div>

          {/* Tampilkan error message jika ada validasi yang gagal */}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Sedang mendaftar...' : 'Daftar'}
          </button>
        </form>

        <div className="register-footer">
          <p>Sudah punya akun? <button onClick={() => navigate('/')} className="link-btn">Masuk di sini</button></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
