import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [checkoutModal, setCheckoutModal] = useState({ show: false, status: null, transactionId: null, message: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editFormData, setEditFormData] = useState({ name: '', price: '', stock: '', category_id: '', description: '', image: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({ name: '', price: '', stock: '', category_id: '', description: '', image: '' });
  const [createImagePreview, setCreateImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Map product names to image files - memoized to prevent unnecessary re-renders
  const imageMap = useMemo(() => ({
    'Kaos Polos Putih': 'Kaos Polos Putih.png',
    'Kaos Polos Hitam': 'Kaos Polos Hitam.png',
    'Kaos anak hebat': 'Kaos anak hebat.png',
    'Celana Jeans Slim Fit': 'Celana Jeans Slim Fit.png',
    'Ikat Pinggang Kulit': 'Ikat Pinggang Kulit.png',
    'jaket outdor': 'jaket outdor.png'
  }), []);

  // Fetch and transform sales data from transactions - wrapped in useCallback
  const fetchSalesData = useCallback(async () => {
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
  }, [userRole]);

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

        // Fetch categories
        try {
          const categoriesData = await apiService.getCategories();
          if (categoriesData && Array.isArray(categoriesData)) {
            setCategories(categoriesData);
          }
        } catch (err) {
          console.warn('Gagal mengambil kategori:', err);
        }

        // Fetch products (untuk semua role)
        const productsData = await apiService.getProducts();
        if (productsData && Array.isArray(productsData)) {
          const mappedProducts = productsData.map(product => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            category: product.category_name || 'Uncategorized',
            image: product.image ? `http://localhost:5000${product.image}` : `/${imageMap[product.name] || product.name + '.png'}`,
            stock: product.stock,
            description: product.description,
            category_id: product.category_id
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
  }, [navigate, fetchSalesData, imageMap]);

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

  // Handle edit product button click
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id || '',
      description: product.description || '',
      image: product.image || ''
    });
    setEditImagePreview(null);
    setShowEditModal(true);
  };

  // Handle update product
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    if (!editFormData.name || !editFormData.price || !editFormData.stock || !editFormData.category_id) {
      alert('Nama, harga, stok, dan kategori harus diisi!');
      return;
    }

    try {
      console.log('📝 [UPDATE] Updating product:', editingProduct.id);
      let imageUrl = editFormData.image;

      // Upload image if new file is selected
      if (editFormData.image && editFormData.image instanceof File) {
        setUploadingImage(true);
        try {
          const uploadResponse = await apiService.uploadImage(editFormData.image);
          imageUrl = uploadResponse.imageUrl;
          console.log('📷 [UPDATE] Image uploaded:', imageUrl);
        } catch (uploadErr) {
          console.error('📷 [UPDATE] Upload error:', uploadErr);
          alert('Gagal mengupload gambar: ' + uploadErr.message);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const payload = {
        name: editFormData.name,
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock),
        category_id: parseInt(editFormData.category_id),
        description: editFormData.description || '',
        image: imageUrl
      };
      console.log('📝 [UPDATE] Payload:', payload);

      const response = await apiService.updateProduct(editingProduct.id, payload);
      console.log('📝 [UPDATE] Response:', response);
      
      // Refresh products list
      const productsData = await apiService.getProducts();
      if (productsData && Array.isArray(productsData)) {
        const mappedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category_name || 'Uncategorized',
          image: product.image ? `http://localhost:5000${product.image}` : `/${imageMap[product.name] || product.name + '.png'}`,
          stock: product.stock,
          description: product.description,
          category_id: product.category_id
        }));
        setProducts(mappedProducts);
      }

      setShowEditModal(false);
      setEditingProduct(null);
      setEditImagePreview(null);
      alert('Produk berhasil diperbarui!');
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Gagal memperbarui produk: ' + (err.message || 'Error'));
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      console.log('🗑 [DELETE] Deleting product ID:', productId);
      await apiService.deleteProduct(productId);
      console.log('✅ [DELETE] Product deleted successfully');
      
      // Refresh products list
      const productsData = await apiService.getProducts();
      if (productsData && Array.isArray(productsData)) {
        const mappedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category_name || 'Uncategorized',
          image: product.image ? `http://localhost:5000${product.image}` : `/${imageMap[product.name] || product.name + '.png'}`,
          stock: product.stock,
          description: product.description,
          category_id: product.category_id
        }));
        setProducts(mappedProducts);
      }

      alert('Produk berhasil dihapus!');
    } catch (err) {
      console.error('❌ [DELETE] Error:', err);
      const errorMsg = err.message || 'Error tidak diketahui';
      alert('Gagal menghapus produk:\n\n' + errorMsg);
    }
  };

  // Handle create product button click
  const handleOpenCreateModal = () => {
    setCreateFormData({ name: '', price: '', stock: '', category_id: '', description: '', image: '' });
    setCreateImagePreview(null);
    setShowCreateModal(true);
  };

  // Handle create product
  const handleCreateProduct = async () => {
    if (!createFormData.name || !createFormData.price || !createFormData.stock || !createFormData.category_id) {
      alert('Nama, harga, stok, dan kategori harus diisi!');
      return;
    }

    // Validate numeric inputs
    const price = parseFloat(createFormData.price);
    const stock = parseInt(createFormData.stock);
    const categoryId = parseInt(createFormData.category_id);
    
    if (isNaN(price) || price <= 0) {
      alert('Harga harus berupa angka positif!');
      return;
    }
    
    if (isNaN(stock) || stock < 0) {
      alert('Stok harus berupa angka positif!');
      return;
    }
    
    if (isNaN(categoryId) || categoryId <= 0) {
      alert('Kategori tidak valid!');
      return;
    }

    try {
      console.log('➕ [CREATE] Creating product...');
      let imageUrl = null;

      // Upload image if file is selected
      if (createFormData.image && createFormData.image instanceof File) {
        setUploadingImage(true);
        try {
          const uploadResponse = await apiService.uploadImage(createFormData.image);
          imageUrl = uploadResponse.imageUrl;
          console.log('📷 [CREATE] Image uploaded:', imageUrl);
        } catch (uploadErr) {
          console.error('📷 [CREATE] Upload error:', uploadErr);
          alert('Gagal mengupload gambar: ' + uploadErr.message);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      const payload = {
        name: createFormData.name,
        price: price,
        stock: stock,
        category_id: categoryId,
        description: createFormData.description || '',
        image: imageUrl
      };
      console.log('➕ [CREATE] Payload:', payload);

      const response = await apiService.createProduct(payload);
      console.log('➕ [CREATE] Response:', response);
      
      // Refresh products list
      const productsData = await apiService.getProducts();
      if (productsData && Array.isArray(productsData)) {
        const mappedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category_name || 'Uncategorized',
          image: product.image ? `http://localhost:5000${product.image}` : `/${imageMap[product.name] || product.name + '.png'}`,
          stock: product.stock,
          description: product.description,
          category_id: product.category_id
        }));
        setProducts(mappedProducts);
      }

      setShowCreateModal(false);
      setCreateFormData({ name: '', price: '', stock: '', category_id: '', description: '', image: '' });
      setCreateImagePreview(null);
      alert('Produk berhasil ditambahkan!');
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Gagal menambahkan produk: ' + (err.message || 'Error'));
    }
  };


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
        // Show modal
        setCheckoutModal({
          show: true,
          status: 'success',
          transactionId: response.transaction_id,
          message: 'Transaksi Anda telah berhasil diproses!'
        });
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
        setCheckoutModal({
          show: true,
          status: 'error',
          transactionId: null,
          message: 'Checkout gagal: Tidak ada ID transaksi dalam response'
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutModal({
        show: true,
        status: 'error',
        transactionId: null,
        message: 'Checkout gagal: ' + (err.message || 'Kesalahan server')
      });
    }
  };

  // sales data is now fetched from API in useEffect above

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">👕 Revandra Shop Dashboard</div>
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
                  {userRole === 'admin' && (
                    <button
                      className="add-product-btn"
                      onClick={handleOpenCreateModal}
                    >
                      ➕ Tambah Produk
                    </button>
                  )}
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
                    {product.description && <p className="description">{product.description}</p>}
                    <p className="stock">Stok: {product.stock}</p>
                    <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Tambah ke Keranjang
                    </button>
                    {userRole === 'admin' && (
                      <div className="admin-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditProduct(product)}
                          title="Edit Produk"
                        >
                          ✎ Edit
                        </button>
                        <button
                          className="edit-desc-btn"
                          onClick={() => {
                            setEditingProduct(product);
                            setEditFormData({
                              name: product.name,
                              price: product.price.toString(),
                              stock: product.stock.toString(),
                              category_id: product.category_id || '',
                              description: product.description || ''
                            });
                            setShowEditModal(true);
                          }}
                          title="Edit Deskripsi"
                        >
                          📝 Deskripsi
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Hapus Produk"
                        >
                          🗑 Hapus
                        </button>
                      </div>
                    )}
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
              <div className="sales-header">
                <div>
                  <h2>📊 Data Penjualan</h2>
                  <p className="sales-subtitle">Ringkasan penjualan real-time Anda</p>
                </div>
                {userRole === 'admin' && (
                  <button 
                    className="refresh-btn"
                    onClick={fetchSalesData}
                  >
                    🔄 Refresh
                  </button>
                )}
              </div>
              
              {userRole !== 'admin' ? (
                <div className="access-denied-box">
                  <div className="denied-icon">🔒</div>
                  <h3>Akses Ditolak</h3>
                  <p>Hanya admin yang dapat melihat data penjualan!</p>
                </div>
              ) : (
                <>
                  {/* Stats Cards */}
                  <div className="sales-stats-grid">
                    <div className="stat-item">
                      <div className="stat-icon">📦</div>
                      <div className="stat-info">
                        <p className="stat-label">Total Penjualan</p>
                        <p className="stat-number">{sales.length}</p>
                        <p className="stat-unit">item terjual</p>
                      </div>
                    </div>
                  </div>

                  {/* Sales Table */}
                  <div className="sales-table-container">
                    <div className="table-header-info">
                      <span className="role-badge">👤 Role: <strong>{userRole}</strong></span>
                      <span className="items-count">📈 Total: <strong>{sales.length}</strong> item</span>
                    </div>
                    
                    {sales.length === 0 ? (
                      <div className="empty-sales-state">
                        <div className="empty-icon">📭</div>
                        <h3>Belum ada data penjualan</h3>
                        <p>Lakukan checkout untuk menambah data penjualan</p>
                      </div>
                    ) : (
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
                          {sales.map((sale, index) => (
                            <tr key={sale.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                              <td><span className="date-badge">{sale.date}</span></td>
                              <td><strong>{sale.product}</strong></td>
                              <td><span className="qty-badge">{sale.qty}</span></td>
                              <td><span className="price-badge">Rp {sale.subtotal.toLocaleString('id-ID')}</span></td>
                              <td><span className="cashier-badge">{sale.kasir || 'N/A'}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Checkout Success/Error Modal */}
      {checkoutModal.show && (
        <div className="modal-overlay" onClick={() => setCheckoutModal({ ...checkoutModal, show: false })}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className={`modal-header ${checkoutModal.status}`}>
              {checkoutModal.status === 'success' ? (
                <>
                  <div className="success-icon">✓</div>
                  <h2>Transaksi Berhasil!</h2>
                </>
              ) : (
                <>
                  <div className="error-icon">!</div>
                  <h2>Transaksi Gagal</h2>
                </>
              )}
            </div>
            
            <div className="modal-content">
              <p className="modal-message">{checkoutModal.message}</p>
              
              {checkoutModal.status === 'success' && checkoutModal.transactionId && (
                <div className="transaction-id-box">
                  <label>ID Transaksi</label>
                  <div className="transaction-id-display">
                    <span>{checkoutModal.transactionId}</span>
                    <button 
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(checkoutModal.transactionId);
                        alert('ID transaksi disalin!');
                      }}
                    >
                      📋
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button 
                className={`modal-btn ${checkoutModal.status}`}
                onClick={() => setCheckoutModal({ ...checkoutModal, show: false })}
              >
                {checkoutModal.status === 'success' ? 'Lanjutkan Belanja' : 'Kembali'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header edit">
              <h2>📝 Edit Produk</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            
            <div className="modal-content">
              <form className="edit-form">
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Harga</label>
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      placeholder="Masukkan harga"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stok</label>
                    <input
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                      placeholder="Masukkan stok"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={editFormData.category_id}
                    onChange={(e) => setEditFormData({ ...editFormData, category_id: e.target.value })}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    placeholder="Masukkan deskripsi produk"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Gambar Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditFormData({ ...editFormData, image: file });
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditImagePreview(event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    placeholder="Pilih gambar produk"
                  />
                </div>

                {editImagePreview && (
                  <div className="form-group">
                    <label>Preview Gambar Baru</label>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                      <img 
                        src={editImagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                )}

                {editingProduct && editingProduct.image && !editImagePreview && (
                  <div className="form-group">
                    <label>Gambar Saat Ini</label>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                      <img 
                        src={editingProduct.image} 
                        alt="Current" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowEditModal(false)}
              >
                Batal
              </button>
              <button 
                className="modal-btn save"
                onClick={handleUpdateProduct}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header edit">
              <h2>➕ Tambah Produk Baru</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>
            
            <div className="modal-content">
              <form className="edit-form">
                <div className="form-group">
                  <label>Nama Produk</label>
                  <input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    placeholder="Masukkan nama produk"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Harga</label>
                    <input
                      type="number"
                      value={createFormData.price}
                      onChange={(e) => setCreateFormData({ ...createFormData, price: e.target.value })}
                      placeholder="Masukkan harga"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stok</label>
                    <input
                      type="number"
                      value={createFormData.stock}
                      onChange={(e) => setCreateFormData({ ...createFormData, stock: e.target.value })}
                      placeholder="Masukkan stok"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Kategori</label>
                  <select
                    value={createFormData.category_id}
                    onChange={(e) => setCreateFormData({ ...createFormData, category_id: e.target.value })}
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Deskripsi</label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                    placeholder="Masukkan deskripsi produk"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Gambar Produk</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCreateFormData({ ...createFormData, image: file });
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setCreateImagePreview(event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    placeholder="Pilih gambar produk"
                  />
                </div>

                {createImagePreview && (
                  <div className="form-group">
                    <label>Preview Gambar</label>
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                      <img 
                        src={createImagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-btn cancel"
                onClick={() => setShowCreateModal(false)}
              >
                Batal
              </button>
              <button 
                className="modal-btn save"
                onClick={handleCreateProduct}
              >
                Tambahkan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
