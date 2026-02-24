// API Service untuk koneksi dengan backend

const API_URL = 'http://localhost:5000';

// Helper function untuk safely parse JSON response
const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return { message: 'Invalid response format' };
    }
  } else {
    const text = await response.text();
    console.error('Received non-JSON response:', text.substring(0, 200));
    return { message: 'Server returned an invalid response' };
  }
};

const apiService = {
  // LOGIN
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

  // REGISTER (untuk customer/public, tanpa perlu token)
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

  // GET TOKEN dari localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // SET TOKEN ke localStorage
  setToken: (token, refreshToken) => {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  // LOGOUT
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // GET PRODUK
  getProducts: async () => {
    try {
      const token = apiService.getToken();
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Add token if available
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

  // GET KATEGORII
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

  // CREATE TRANSAKSI
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

  // GET SEMUA TRANSAKSI (untuk melihat data penjualan - admin only)
  getTransactions: async () => {
    try {
      console.log('🔄 [getTransactions] Starting...');
      const token = apiService.getToken();
      console.log('🔄 [getTransactions] Token exists?', !!token);
      
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

  // GET DETAIL TRANSAKSI DENGAN ITEMS
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
};

export default apiService;
