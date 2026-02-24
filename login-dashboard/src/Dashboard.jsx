import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import apiService from './services/apiService';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Map product names to image files
  const imageMap = {
    'Kaos Polos Putih': 'Kaos Polos Putih.png',
    'Kaos Polos Hitam': 'Kaos Polos Hitam.png',
    'Kaos anak hebat': 'Kaos anak hebat.png',
    'Celana Jeans Slim Fit': 'Celana Jeans Slim Fit.png',
    'Ikat Pinggang Kulit': 'Ikat Pinggang Kulit.png',
    'jaket outdor': 'jaket outdor.png'
  };

  // Fetch products and sales data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!token) {
          navigate('/');
          return;
        }

        // Set user role
        if (user && user.role) {
          setUserRole(user.role);
        }

        // Fetch products (untuk semua role)
        const productsData = await apiService.getProducts();
        if (productsData && Array.isArray(productsData)) {
          const mappedProducts = productsData.map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            category: product.category_name || 'Uncategorized',
            image: `/${imageMap[product.name] || product.name + '.png'}`,
            stock: product.stock,
            description: product.description
          }));
          setProducts(mappedProducts);
        }

        // Fetch transactions only untuk admin
        if (user && user.role === 'admin') {
          await fetchSalesData();
        } else {
          setSales([]); // Clear sales untuk non-admin
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Gagal memuat data dari server');
        setProducts([]);
        setSales([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  // Fetch and transform sales data from transactions
  const fetchSalesData = async () => {
    try {
      console.log('📊 [fetchSalesData] Starting...');
      console.log('📊 [fetchSalesData] User role:', userRole);
      
      if (userRole !== 'admin') {
        console.warn('⚠️  [fetchSalesData] User is not admin, skipping fetch');
        setSales([]);
        return;
      }

      console.log('📊 [fetchSalesData] Calling getTransactions()...');
      const transactionsData = await apiService.getTransactions();
      console.log('📊 [fetchSalesData] Response:', transactionsData);
      console.log('📊 [fetchSalesData] Response type:', Array.isArray(transactionsData));
      
      if (!transactionsData) {
        console.warn('⚠️  [fetchSalesData] transactionsData is null/undefined');
        setSales([]);
        return;
      }

      if (!Array.isArray(transactionsData)) {
        console.warn('⚠️  [fetchSalesData] transactionsData is not an array:', typeof transactionsData);
        setSales([]);
        return;
      }

      console.log(`📊 [fetchSalesData] Found ${transactionsData.length} transactions`);
      
      if (transactionsData.length === 0) {
        console.warn('⚠️  [fetchSalesData] No transactions returned from API');
        setSales([]);
        return;
      }

      const salesData = [];
      
      for (const tx of transactionsData) {
        try {
          console.log(`📊 [fetchSalesData] Processing TX #${tx.id}...`);
          const detail = await apiService.getTransactionDetail(tx.id);
          console.log(`📊 [fetchSalesData] Detail for TX #${tx.id}:`, detail);
          
          if (detail && detail.items && Array.isArray(detail.items)) {
            console.log(`📊 [fetchSalesData] TX #${tx.id} has ${detail.items.length} items`);
            detail.items.forEach(item => {
              salesData.push({
                id: tx.id + '-' + item.product_id,
                transaction_id: tx.id,
                date: new Date(tx.created_at).toLocaleDateString('id-ID'),
                product: item.product_name,
                qty: item.quantity,
                subtotal: item.subtotal,
                kasir: tx.name || tx.email
              });
            });
          } else {
            console.warn(`⚠️  [fetchSalesData] TX #${tx.id} has no items or items not array`);
          }
        } catch (detailErr) {
          console.error(`❌ [fetchSalesData] Error fetching detail for TX #${tx.id}:`, detailErr.message);
        }
      }
      
      console.log(`📊 [fetchSalesData] Total sales items processed: ${salesData.length}`);
      console.log('📊 [fetchSalesData] Sales data:', salesData);
      setSales(salesData);
    } catch (err) {
      console.error('❌ [fetchSalesData] Error:', err.message);
      console.error('❌ [fetchSalesData] Full error:', err);
      setSales([]);
    }
  };

  // Old hardcoded products - replaced by API fetch above
  /* Commented out - now fetched from API
  const oldProducts = [
    {
      id: 1,
      name: 'T-Shirt Premium',
      price: 150000,
      category: 'Atasan',
      image: '/T-Shirt Premium.png',
      stock: 50,
    },
    {
      id: 2,
      name: 'Jeans Casual',
      price: 350000,
      category: 'Bawahan',
      image: '/Jeans Casual.png',
      stock: 30,
    },
    {
      id: 3,
      name: 'Kemeja Formal',
      price: 280000,
      category: 'Atasan',
      image: '/Kemeja Formal.png',
      stock: 25,
    },
    {
      id: 4,
      name: 'Celana Chino',
      price: 300000,
      category: 'Bawahan',
      image: '/Celana Chino.png',
      stock: 40,
    },
    {
      id: 5,
      name: 'Jaket Denim',
      price: 450000,
      category: 'Outer',
      image: '/Jaket Denim.png',
      stock: 20,
    },
    {
      id: 6,
      name: 'Dress Wanita',
      price: 400000,
      category: 'Dress',
      image: '/Dress Wanita.png',
      stock: 35,
    },
  ];
  */

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item.id !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === productId ? { ...item, qty } : item
        )
      );
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Handle checkout - submit transaction to reduce stock
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }

    console.log('🛒 [Checkout] Starting...');
    console.log('🛒 [Checkout] Cart items:', cartItems);

    try {
      // Format items for API: needs product_id, quantity, price
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.qty,
        price: item.price
      }));

      console.log('🛒 [Checkout] Formatted items:', items);
      console.log('🛒 [Checkout] Total price:', totalPrice);

      // Call API to create transaction (this will reduce stock)
      console.log('🛒 [Checkout] Calling createTransaction...');
      const response = await apiService.createTransaction(items, totalPrice);
      
      console.log('🛒 [Checkout] Response:', response);

      if (response && response.transaction_id) {
        console.log('✅ [Checkout] Checkout success! Transaction ID:', response.transaction_id);
        alert('✅ Transaksi berhasil! ID Transaksi: ' + response.transaction_id);
        setCartItems([]); // Clear cart
        setShowCart(false); // Close cart panel
        
        // Refresh products to show updated stock
        console.log('🛒 [Checkout] Refreshing products...');
        const data = await apiService.getProducts();
        if (data && Array.isArray(data)) {
          const mappedProducts = data.map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            category: product.category_name || 'Uncategorized',
            image: `/${imageMap[product.name] || product.name + '.png'}`,
            stock: product.stock,
            description: product.description
          }));
          setProducts(mappedProducts);
          console.log('✅ [Checkout] Products refreshed');
        }
        
        // Refresh sales data
        console.log('🛒 [Checkout] Refreshing sales data...');
        await fetchSalesData();
        
        // Switch to sales tab untuk admin atau tetap di products untuk kasir
        if (userRole === 'admin') {
          console.log('👤 [Checkout] Admin detected - switching to sales tab');
          setActiveTab('sales');
        }
      } else {
        console.error('❌ [Checkout] No transaction_id in response:', response);
        alert('❌ Checkout gagal: Tidak ada ID transaksi dalam response');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('❌ Checkout gagal: ' + (err.message || 'Kesalahan server'));
    }
  };

  // sales data is now fetched from API in useEffect above

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">👕 Endro store Dashboard</div>
        <div className="navbar-user">
          <span>Bem-vindo!</span>
          <button className="logout-btn" onClick={handleLogout}>
            Keluar
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <aside className="sidebar">
          <ul className="menu">
            <li>
              <button
                className={`menu-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                📦 Produk
              </button>
            </li>
            {userRole === 'admin' && (
              <li>
                <button
                  className={`menu-item ${activeTab === 'sales' ? 'active' : ''}`}
                  onClick={() => setActiveTab('sales')}
                >
                  📊 Penjualan
                </button>
              </li>
            )}
            <li>
              <button
                className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                📋 Pesanan
              </button>
            </li>
            <li>
              <button
                className={`menu-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📈 Analitik
              </button>
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {/* Loading State */}
          {loading && (
            <div className="tab-content">
              <p style={{ textAlign: 'center', padding: '20px' }}>⏳ Memuat produk...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="tab-content">
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#fee', 
                border: '1px solid #fcc', 
                borderRadius: '4px',
                color: '#c33'
              }}>
                <p>❌ {error}</p>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && !loading && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Daftar Produk ({products.length})</h2>
                <div className="cart-badge-container">
                  <button
                    className="cart-toggle"
                    onClick={() => setShowCart(!showCart)}
                  >
                    🛒 Keranjang ({totalItems})
                  </button>
                </div>
              </div>

              <div className="products-grid">
                {products.map((product) => (
                  <div key={product.id} className="product-card">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <h3>{product.name}</h3>
                    <p className="category">{product.category}</p>
                    <p className="stock">Stok: {product.stock}</p>
                    <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Tambah ke Keranjang
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Sidebar */}
              {showCart && (
                <div className="cart-panel">
                  <h3>🛒 Keranjang ({totalItems})</h3>
                  {cartItems.length === 0 ? (
                    <p className="empty-cart">Keranjang kosong</p>
                  ) : (
                    <>
                      <div className="cart-items">
                        {cartItems.map((item) => (
                          <div key={item.id} className="cart-item">
                            <div className="cart-item-info">
                              <img src={item.image} alt={item.name} className="item-image" />
                              <div>
                                <p className="item-name">{item.name}</p>
                                <p className="item-price">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <div className="cart-item-qty">
                              <button onClick={() => updateQty(item.id, item.qty - 1)}>
                                -
                              </button>
                              <span>{item.qty}</span>
                              <button onClick={() => updateQty(item.id, item.qty + 1)}>
                                +
                              </button>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => removeFromCart(item.id)}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="cart-total">
                        <strong>Total: Rp {totalPrice.toLocaleString('id-ID')}</strong>
                        <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sales Tab */}
          {activeTab === 'sales' && (
            <div className="tab-content">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📊 Data Penjualan</h2>
                {userRole === 'admin' && (
                  <button 
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={fetchSalesData}
                  >
                    🔄 Refresh
                  </button>
                )}
              </div>
              
              {userRole !== 'admin' ? (
                <div style={{ padding: '20px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '4px', color: '#c33', textAlign: 'center' }}>
                  <p>❌ Akses Ditolak</p>
                  <p>Hanya admin yang dapat melihat data penjualan!</p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                    <small>👤 Role: <strong>{userRole}</strong> | 📈 Total Penjualan: <strong>{sales.length}</strong> items</small>
                  </div>
                  <table className="sales-table">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Kasir</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                            <div>
                              <p>📭 Belum ada data penjualan</p>
                              <small style={{ color: '#666' }}>
                                Lakukan checkout untuk menambah data
                              </small>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        sales.map((sale) => (
                          <tr key={sale.id}>
                            <td>{sale.date}</td>
                            <td>{sale.product}</td>
                            <td style={{ textAlign: 'center' }}>{sale.qty}</td>
                            <td>Rp {sale.subtotal.toLocaleString('id-ID')}</td>
                            <td>{sale.kasir || 'N/A'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h2>Pesanan</h2>
              <div className="orders-grid">
                <div className="order-card">
                  <h4>Pesanan #001</h4>
                  <p>Status: ✅ Selesai</p>
                  <p>Total: Rp 750.000</p>
                </div>
                <div className="order-card">
                  <h4>Pesanan #002</h4>
                  <p>Status: 📦 Pengiriman</p>
                  <p>Total: Rp 1.050.000</p>
                </div>
                <div className="order-card">
                  <h4>Pesanan #003</h4>
                  <p>Status: ⏳ Pending</p>
                  <p>Total: Rp 560.000</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="tab-content">
              <h2>Analitik</h2>
              <div className="analytics-grid">
                <div className="stat-card">
                  <h4>Total Penjualan</h4>
                  <p className="stat-value">Rp 2.360.000</p>
                </div>
                <div className="stat-card">
                  <h4>Total Pesanan</h4>
                  <p className="stat-value">12</p>
                </div>
                <div className="stat-card">
                  <h4>Produk Terjual</h4>
                  <p className="stat-value">47</p>
                </div>
                <div className="stat-card">
                  <h4>Rata-rata Order</h4>
                  <p className="stat-value">Rp 196.667</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
