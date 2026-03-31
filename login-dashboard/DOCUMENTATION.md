# Login Dashboard - Documentation

Dokumentasi lengkap untuk struktur dan deskripsi kode aplikasi Login Dashboard.

## Struktur Folder

```
login-dashboard/
├── public/              # File HTML dan assets publik
│   ├── index.html       # Entry point HTML
│   └── Dashboard.jsx    # Dashboard component
├── src/                 # Source code aplikasi
│   ├── App.jsx          # Main app router
│   ├── index.js         # Entry point React
│   ├── Login.jsx        # Login component
│   ├── Register.jsx     # Register component
│   ├── Products.jsx     # Products component
│   ├── pages/           # Page components folder
│   │   ├── Register.jsx # Register page
│   │   └── Register.css # Register styles
│   └── services/        # API services
│       └── apiService.js # Backend API communication
├── package.json         # Dependencies
└── README.md            # Project readme
```

## File Descriptions

### Main Components

#### `src/App.jsx` - Application Router
**Tujuan:** Mengatur routing untuk seluruh aplikasi
**Routes:**
- `/` - Login page
- `/register` - Register page  
- `/dashboard` - Admin dashboard
- `/products` - Products listing

#### `src/Login.jsx` - Login Component
**Tujuan:** Form login untuk user/admin
**Fitur:**
- Email dan password validation
- Error handling
- Token management (localStorage)
- Redirect to dashboard setelah login
**Validasi:**
- Email format validation
- Password minimal 6 karakter

#### `src/Register.jsx` - Register Component
**Tujuan:** Form registrasi akun baru untuk customer
**Fitur:**
- Validasi form lengkap (name, email, password)
- Password confirmation check
- Error messages
- Redirect to login setelah register berhasil
**Validasi:**
- Nama minimal 3 karakter
- Email format valid
- Password minimal 6 karakter
- Password harus matching

#### `src/Products.jsx` - Products Component
**Tujuan:** Menampilkan daftar produk dalam grid
**Fitur:**
- Fetch produk dari API
- Authentication check
- Loading state
- Error handling
- Product card display dengan harga dan stok
**Auth:** Memerlukan token akses (user harus login)

#### `public/Dashboard.jsx` - Dashboard Component
**Tujuan:** Halaman dashboard admin
**Fitur:**
- Welcome message
- "Lihat Produk" button (goto products page)
- "Logout" button (goto login page)

### Services

#### `src/services/apiService.js` - API Service
**Tujuan:** Menghandle semua komunikasi dengan backend API
**Base URL:** `http://localhost:5000`
**Auth:** JWT Bearer Token

**Methods:**

##### Authentication
- `login(email, password)` - Login user dengan email & password
- `register(name, email, password)` - Register customer baru
- `getToken()` - Ambil token dari localStorage
- `setToken(token, refreshToken)` - Simpan token ke localStorage
- `logout()` - Hapus semua data session

##### Products
- `getProducts()` - Ambil semua produk (memerlukan auth)
- `getCategories()` - Ambil semua kategori produk
- `createProduct(productData)` - Create produk baru (admin only)
- `updateProduct(productId, productData)` - Update produk (admin only)
- `deleteProduct(productId)` - Delete produk (admin only)

##### Transactions
- `createTransaction(items, totalPrice)` - Buat transaksi penjualan
- `getTransactions()` - Ambil semua transaksi (admin only)
- `getTransactionDetail(transactionId)` - Ambil detail transaksi

**Helper Methods:**
- `parseJsonResponse(response)` - Parse JSON response dengan error handling

### Main Entry Points

#### `src/index.js` - React Entry Point
**Tujuan:** Entry point untuk aplikasi React
**Fitur:**
- Render App component ke DOM (#root)
- React.StrictMode untuk development warnings
- Performance measurement

### HTML

#### `public/index.html`
**Meta Tags:**
- Title: Revandra - Toko Pakaian Online
- Description: Revandra - Toko Pakaian Online
- Viewport: Responsive design setup
- App icons: logo512.png

## State Management

### Login Component State
```javascript
- email: string
- password: string
- error: string
- loading: boolean
```

### Register Component State
```javascript
- formData: {name, email, password, confirmPassword}
- error: string
- loading: boolean
```

### Products Component State
```javascript
- products: array
- loading: boolean
- error: string
```

## Error Handling

### Validation Errors
- Login: Email format, password length
- Register: All fields required, name length, email format, password matching

### API Errors
- Network errors dengan try-catch
- JSON parse errors dengan fallback
- 401/403 status code handling
- Generic error messages untuk user

## Token Management

**Storage:** localStorage
**Keys:**
- `token` - JWT access token
- `refreshToken` - JWT refresh token
- `user` - User info (JSON string)

**Token Flow:**
1. Login → Receive token
2. setToken() → Save to localStorage
3. API Calls → Attach in Authorization header
4. Logout → Remove all tokens

## Authentication Flow

### Login Flow
1. User submits email + password
2. Validate inputs (format, length)
3. Call apiService.login()
4. Receive token + user data
5. Save to localStorage
6. Redirect to /dashboard

### Register Flow
1. User fills form (name, email, password)
2. Validate all inputs
3. Call apiService.register()
4. Show success alert
5. Redirect to / (login page)

### Protected Routes
- /dashboard - Requires valid token
- /products - Requires valid token

## API Endpoints Used

```
POST   /auth/login              - User login
POST   /auth/register-customer  - Customer registration
GET    /products                - Get all products
GET    /categories              - Get product categories
GET    /transactions            - Get all transactions (admin)
GET    /transactions/:id        - Get transaction detail (admin)
POST   /transactions            - Create transaction
POST   /products                - Create product (admin)
PUT    /products/:id            - Update product (admin)
DELETE /products/:id            - Delete product (admin)
```

## Development Tips

### Running the Application
```bash
cd login-dashboard
npm install
npm start  # Start development server
```

### API Backend Required
Make sure backend is running on `http://localhost:5000`

### Debug Logging
Console logs are included for:
- Transaction fetch operations
- API response status
- Error messages

### Error Messages
Error messages are in Indonesian for user experience.

## Code Comments

Semua functions dan methods sudah dilengkapi dengan:
1. **JSDoc Comments** - Parameter, return type, descriptions
2. **Inline Comments** - Penjelasan logic kompleks
3. **Block Comments** - File headers dan feature descriptions

## Best Practices Implemented

1. **Error Handling** - Try-catch dengan informative messages
2. **Validation** - Input validation sebelum submit
3. **State Management** - Proper React state usage
4. **Loading States** - Show loading indicators
5. **Token Security** - JWT token in Authorization header
6. **Code Organization** - Separation of concerns (components, services)

---

**Last Updated:** March 2026
**Version:** 1.0.0
