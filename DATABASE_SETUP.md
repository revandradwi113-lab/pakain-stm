# Instrução Setup Database - Toko Pakaian Online

## 📋 Pré-requisitos
- PostgreSQL instalado e rodando
- DBeaver ou psql client

## 🗄️ Passos Setup

### 1. Abrir PostgreSQL
```bash
# No terminal, se tiver psql instalado:
psql -U postgres
```

### 2. Criar Database
```sql
CREATE DATABASE toko_online;
\c toko_online
```

### 3. Executar Script SQL
Execute o conteúdo de `db_setup.sql` para criar as tabelas:

```sql
-- Criar tabela users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer' CHECK(role IN ('admin', 'kasir', 'customer')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Criar tabela categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category_id INT REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela transactions
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_price DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela transaction_items
CREATE TABLE IF NOT EXISTS transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id INT REFERENCES transactions(id),
  product_id INT REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Testar Conexão

Frontend rodando em: **http://localhost:3001**
Backend rodando em: **http://localhost:5000**

## ✅ Funcionalidades Implementadas

### Login & Register
- ✅ Form login com email e password
- ✅ Form register para criar conta customer
- ✅ Hash password com bcrypt
- ✅ JWT token para autenticação
- ✅ Validação de email UNIQUE
- ✅ Armazenamento de token no localStorage

### Backend
- ✅ Endpoint `/auth/login` - Login com email
- ✅ Endpoint `/auth/register-customer` - Registrar customer
- ✅ Endpoint `/auth/register` - Registrar admin/kasir (protegido)
- ✅ Database schema com email (sem username)
- ✅ CORS habilitado para localhost:3001

## 🔧 Mudanças Realizadas

1. **Backend Auth Routes**
   - Substituí `username` por `email`
   - Atualizei validações
   - Adicionei endpoint público `/register-customer`

2. **Frontend Components**
   - Login.jsx - Usando email ao invés de username
   - Register.jsx - Já estava correto
   - apiService.js - Atualizado para usar email

3. **Database**
   - Removido campo `username`
   - Adicionado campo `email` como UNIQUE
   - Criado index para performance

## 🚀 Como Testar

1. Acesse **http://localhost:3001**
2. Clique "Daftar di sini"
3. Preencha: Nama, Email, Password (min 6 karakter)
4. Clique "Daftar"
5. Faça login com o email registrado

Pronto! ✨
