/**
 * Main Entry Point untuk Login Dashboard Application
 * Menggunakan React 18 dengan ReactDOM API yang baru
 * Merender App component ke DOM root element (#root)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Buat root React untuk merender aplikasi
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render App component dengan React.StrictMode untuk development warnings
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Mengukur performance aplikasi (optional - bisa diganti dengan console.log atau analytics)
// reportWebVitals(console.log) - untuk log performance metrics
// Lihat: https://bit.ly/CRA-vitals
reportWebVitals();
