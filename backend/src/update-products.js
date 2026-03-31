// Script untuk menambahkan/update produk dengan deskripsi
const pool = require('./db/pool');

const updateProducts = async () => {
  try {
    console.log('📦 Update produk dengan deskripsi...');

    const products = [
      {
        name: 'Kaos Polos Putih',
        description: 'Kaos polos putih premium bahan katun berkualitas tinggi, nyaman digunakan sepanjang hari',
        price: 89000,
        stock: 50,
        category_id: 1
      },
      {
        name: 'Kaos Polos Hitam',
        description: 'Kaos polos hitam dengan bahan katun 100% yang lembut dan breathable',
        price: 89000,
        stock: 45,
        category_id: 1
      },
      {
        name: 'Kaos anak hebat',
        description: 'Kaos anak dengan desain lucu dan motivasi positif, cocok untuk anak-anak',
        price: 75000,
        stock: 60,
        category_id: 1
      },
      {
        name: 'Celana Jeans Slim Fit',
        description: 'Celana jeans slim fit dengan potongan modern dan desain trendy, cocok untuk casual',
        price: 250000,
        stock: 40,
        category_id: 2
      },
      {
        name: 'Ikat Pinggang Kulit',
        description: 'Ikat pinggang kulit asli dengan gesper metal berkualitas, tahan lama dan elegan',
        price: 120000,
        stock: 30,
        category_id: 2
      },
      {
        name: 'jaket outdor',
        description: 'Jaket outdoor tahan air dengan material berkualitas, cocok untuk berbagai aktivitas outdoor',
        price: 450000,
        stock: 25,
        category_id: 3
      }
    ];

    for (const product of products) {
      // Cek apakah produk sudah ada
      const existingProduct = await pool.query(
        'SELECT id FROM products WHERE name = $1',
        [product.name]
      );

      if (existingProduct.rows.length > 0) {
        // Update produk yang sudah ada
        await pool.query(
          'UPDATE products SET description = $1, price = $2, stock = $3, category_id = $4 WHERE name = $5',
          [product.description, product.price, product.stock, product.category_id, product.name]
        );
        console.log(`✅ Updated: ${product.name}`);
      } else {
        // Insert produk baru
        await pool.query(
          'INSERT INTO products (name, description, price, stock, category_id) VALUES ($1, $2, $3, $4, $5)',
          [product.name, product.description, product.price, product.stock, product.category_id]
        );
        console.log(`✅ Added: ${product.name}`);
      }
    }

    console.log('✨ Semua produk berhasil diupdate!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

updateProducts();
