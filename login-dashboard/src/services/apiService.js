/**
 * API Service Module
 * Menangani semua komunikasi dengan backend API
 * Fitur: Login, Register, Token Management, Fetch Products/Categories/Transactions
 * 
 * Base URL: 
 * - Development: http://localhost:5000
 * - Production: https://your-vercel-domain.vercel.app
 * Auth: Menggunakan JWT Bearer Token
 */

// Determine API URL based on environment
const API_URL = process.env.NODE_ENV === 'production' 
  ? (process.env.REACT_APP_API_URL || window.location.origin)
  : 'http://localhost:5000';

/**
 * parseJsonResponse - Helper function untuk safely parse JSON response
 * Menangani response yang bukan JSON format dengan error handling
 * 
 * @param {Response} response - Fetch response object
 * @returns {Object} JSON data atau error message
 */
const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  // Jika response adalah JSON, parse dengan try-catch
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return { message: 'Invalid response format' };
    }
  } else {
    // Jika response bukan JSON, log error
    const text = await response.text();
    console.error('Received non-JSON response:', text.substring(0, 200));
    return { message: 'Server returned an invalid response' };
  }
};

const apiService = {
  /**
   * login - Login user dengan email dan password
   * 
   * @param {string} email - Email untuk login
   * @param {string} password - Password user
   * @returns {Promise<Object>} Response berisi token, refreshToken, dan user data
   * @throws {Error} Jika login gagal
   */
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        throw new Error(error.message || 'Login gagal');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * register - Register customer baru (public endpoint, tidak perlu token)
   * 
   * @param {string} name - Nama lengkap customer
   * @param {string} email - Email customer
   * @param {string} password - Password customer
   * @returns {Promise<Object>} Response dari server (success message atau user data)
   * @throws {Error} Jika registrasi gagal
   */
  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/register-customer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        throw new Error(error.message || 'Register gagal');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * getToken - Ambil token akses dari localStorage
   * 
   * @returns {string|null} JWT token atau null jika tidak ada
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * setToken - Simpan token dan refresh token ke localStorage
   * 
   * @param {string} token - JWT access token
   * @param {string} refreshToken - JWT refresh token (optional)
   */
  setToken: (token, refreshToken) => {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  /**
   * logout - Hapus semua token dan user data dari localStorage
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  /**
   * getProducts - Ambil daftar semua produk (public endpoint)
   * Memerlukan auth token untuk akses
   * 
   * @returns {Promise<Array>} Array of product objects
   * @throws {Error} Jika fetch gagal
   */
  getProducts: async () => {
    try {
      // Ambil token dari localStorage
      const token = apiService.getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Tambahkan token ke header jika ada
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil produk');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * getCategories - Ambil daftar kategori produk
   * Memerlukan auth token untuk akses
   * 
   * @returns {Promise<Array>} Array of category objects
   * @throws {Error} Jika fetch gagal
   */
  getCategories: async () => {
    try {
      const token = apiService.getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add token if available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: headers,
      });

      if (!response.ok) {
        throw new Error('Gagal mengambil kategori');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * createTransaction - Buat transaksi penjualan baru
   * Memerlukan auth token (customer/admin)
   * 
   * @param {Array} items - Array items yang dibeli (format: [{product_id, quantity, price}, ...])
   * @param {number} totalPrice - Total harga transaksi
   * @returns {Promise<Object>} Response berisi transaction_id dan status
   * @throws {Error} Jika pembuatan transaksi gagal
   */
  createTransaction: async (items, totalPrice) => {
    try {
      const token = apiService.getToken();
      const response = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items, total_price: totalPrice }),
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        throw new Error(error.message || 'Gagal membuat transaksi');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * getTransactions - Ambil semua data transaksi (admin only)
   * Menampilkan semua transaksi penjualan di sistem
   * Memerlukan admin access token
   * 
   * @returns {Promise<Array>} Array of transaction objects
   * @throws {Error} Jika access denied atau fetch gagal
   */
  getTransactions: async () => {
    try {
      console.log('🔄 [getTransactions] Starting...');
      const token = apiService.getToken();
      console.log('🔄 [getTransactions] Token exists?', !!token);
      
      // Validasi token ada
      if (!token) {
        throw new Error('Token tidak ditemukan. Silakan login kembali.');
      }

      const url = `${API_URL}/transactions`;
      console.log('🔄 [getTransactions] Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('🔄 [getTransactions] Response status:', response.status);
      console.log('🔄 [getTransactions] Response ok?', response.ok);

      if (!response.ok) {
        const text = await response.text();
        console.error('🔄 [getTransactions] Response text:', text.substring(0, 200));
        
        // Handle specific error codes
        if (response.status === 403) {
          throw new Error('Akses ditolak! Hanya admin yang dapat melihat data penjualan.');
        }
        if (response.status === 401) {
          throw new Error('Token tidak valid. Silakan login kembali.');
        }
        const error = await parseJsonResponse(response);
        throw new Error(error.message || 'Gagal mengambil data transaksi');
      }

      const data = await parseJsonResponse(response);
      console.log('🔄 [getTransactions] Data received:', data);
      console.log('🔄 [getTransactions] Is array?', Array.isArray(data));
      console.log('🔄 [getTransactions] Length:', data ? data.length : 'null');
      
      return data || [];
    } catch (error) {
      console.error('❌ [getTransactions] Error:', error.message);
      throw error;
    }
  },

  /**
   * getTransactionDetail - Ambil detail transaksi beserta items-nya
   * Detail lengkap untuk satu transaksi (admin only)
   * 
   * @param {number} transactionId - ID transaksi yang akan diambil detailnya
   * @returns {Promise<Object>} Object berisi data transaksi dan items details
   * @throws {Error} Jika access denied atau fetch gagal
   */
  getTransactionDetail: async (transactionId) => {
    try {
      console.log(`🔄 [getTransactionDetail] Fetching TX #${transactionId}...`);
      const token = apiService.getToken();
      
      const url = `${API_URL}/transactions/${transactionId}`;
      console.log(`🔄 [getTransactionDetail] URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log(`🔄 [getTransactionDetail] Status: ${response.status}`);

      if (!response.ok) {
        const text = await response.text();
        console.error(`🔄 [getTransactionDetail] Error response: ${text.substring(0, 200)}`);
        
        // Handle authorization error
        if (response.status === 403) {
          throw new Error('Akses ditolak! Hanya admin yang dapat melihat detail transaksi.');
        }
        const error = await parseJsonResponse(response);
        throw new Error(error.message || 'Gagal mengambil detail transaksi');
      }

      const data = await parseJsonResponse(response);
      console.log(`🔄 [getTransactionDetail] Data received:`, data);
      return data;
    } catch (error) {
      console.error(`❌ [getTransactionDetail] Error for TX #${transactionId}:`, error.message);
      throw error;
    }
  },

  /**
   * createProduct - Buat produk baru (admin only)
   * Memerlukan admin access token
   * 
   * @param {Object} productData - Data produk (name, description, price, stock, category_id)
   * @returns {Promise<Object>} Response berisi product_id dan status
   * @throws {Error} Jika akses ditolak atau pembuatan gagal
   */
  createProduct: async (productData) => {
    try {
      const token = apiService.getToken();
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        if (response.status === 403) {
          throw new Error('Hanya admin yang dapat membuat produk');
        }
        throw new Error(error.message || 'Gagal membuat produk');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * updateProduct - Update data produk yang sudah ada (admin only)
   * Memerlukan admin access token
   * 
   * @param {number} productId - ID produk yang akan diupdate
   * @param {Object} productData - Data produk yang diubah (name, description, price, stock, category_id)
   * @returns {Promise<Object>} Response berisi status dan updated product data
   * @throws {Error} Jika akses ditolak atau update gagal
   */
  updateProduct: async (productId, productData) => {
    try {
      const token = apiService.getToken();
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        if (response.status === 403) {
          throw new Error('Hanya admin yang dapat mengubah produk');
        }
        throw new Error(error.message || 'Gagal mengubah produk');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * deleteProduct - Hapus produk dari database (admin only)
   * Memerlukan admin access token
   * 
   * @param {number} productId - ID produk yang akan dihapus
   * @returns {Promise<Object>} Response berisi status dan pesan konfirmasi
   * @throws {Error} Jika akses ditolak atau delete gagal
   */
  deleteProduct: async (productId) => {
    try {
      const token = apiService.getToken();
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        if (response.status === 403) {
          throw new Error('Hanya admin yang dapat menghapus produk');
        }
        throw new Error(error.message || 'Gagal menghapus produk');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * uploadImage - Upload gambar produk ke server
   * 
   * @param {File} file - File gambar yang akan diupload
   * @returns {Promise<Object>} Response berisi imageUrl
   * @throws {Error} Jika upload gagal
   */
  uploadImage: async (file) => {
    try {
      const token = apiService.getToken();
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/products/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await parseJsonResponse(response);
        throw new Error(error.message || 'Gagal mengupload gambar');
      }

      const data = await parseJsonResponse(response);
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService;
