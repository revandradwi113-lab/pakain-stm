// =============================================================
// 📁 FILE: src/routes/products.js
// 📚 Deskripsi:
//    API untuk mengelola produk pakaian.
//    Kasir & Admin bisa melihat produk,
//    hanya Admin yang boleh menambah, mengubah, dan menghapus.
//    Sudah dilengkapi dokumentasi Swagger di /api-docs.
// =============================================================

const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const authenticateToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const upload = require("../middleware/upload");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API untuk mengelola data produk pakaian
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Ambil semua produk (admin & kasir)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua produk berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Kaos Polos
 *                   price:
 *                     type: number
 *                     example: 75000
 *                   stock:
 *                     type: integer
 *                     example: 100
 *                   category_name:
 *                     type: string
 *                     example: Pakaian Pria
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Ambil produk berdasarkan ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk yang ingin dilihat
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Detail produk berhasil diambil
 *       404:
 *         description: Produk tidak ditemukan
 */
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /products/upload:
 *   post:
 *     summary: Upload gambar untuk produk (hanya admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Gambar berhasil diupload
 *       400:
 *         description: File tidak valid
 */
router.post("/upload", authenticateToken, requireRole("admin"), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    console.log('📷 [UPLOAD] Image uploaded:', imageUrl);
    res.json({ message: "Image uploaded successfully", imageUrl: imageUrl });
  } catch (error) {
    console.error('❌ [UPLOAD] Error:', error.message);
    res.status(500).json({ message: "Upload failed: " + error.message });
  }
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Tambahkan produk baru (hanya admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - category_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jaket Denim
 *               description:
 *                 type: string
 *                 example: Jaket denim berkualitas tinggi
 *               price:
 *                 type: number
 *                 example: 250000
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               image:
 *                 type: string
 *                 example: /uploads/image-123456.png
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 *       400:
 *         description: Field input tidak lengkap
 *       403:
 *         description: Hanya admin yang boleh menambahkan produk
 */
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { name, price, stock, category_id, description, image } = req.body;
    if (!name || price === undefined || stock === undefined || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate numeric values
    const numPrice = parseFloat(price);
    const numStock = parseInt(stock);
    const numCategoryId = parseInt(category_id);
    
    if (isNaN(numPrice) || numPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }
    
    if (isNaN(numStock) || numStock < 0) {
      return res.status(400).json({ message: "Stock must be a non-negative number" });
    }
    
    if (isNaN(numCategoryId) || numCategoryId <= 0) {
      return res.status(400).json({ message: "Invalid category_id" });
    }

    const result = await pool.query(
      "INSERT INTO products (name, description, price, stock, category_id, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description || '', numPrice, numStock, numCategoryId, image || null]
    );

    console.log('✅ [CREATE] Product created:', result.rows[0].id);
    res.status(201).json({ message: "Product added successfully", product: result.rows[0] });
  } catch (error) {
    console.error('❌ [CREATE] Error:', error.message);
    console.error('❌ [CREATE] Full error:', error.detail || error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Ubah produk berdasarkan ID (hanya admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk yang ingin diubah
 *         schema:
 *           type: integer
 *           example: 3
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kaos Lengan Panjang
 *               description:
 *                 type: string
 *                 example: Kaos lengan panjang berkualitas premium
 *               price:
 *                 type: number
 *                 example: 90000
 *               stock:
 *                 type: integer
 *                 example: 80
 *               category_id:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Produk berhasil diperbarui
 *       404:
 *         description: Produk tidak ditemukan
 */
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, category_id, description, image } = req.body;

    console.log('📝 [UPDATE] Product ID:', id);
    console.log('📝 [UPDATE] Data:', { name, price, stock, category_id, description, image });

    // Validate required fields
    if (!name || price === undefined || stock === undefined || !category_id) {
      console.log('❌ [UPDATE] Missing required fields');
      return res.status(400).json({ 
        message: "Missing required fields: name, price, stock, category_id" 
      });
    }

    const result = await pool.query(
      "UPDATE products SET name=$1, description=$2, price=$3, stock=$4, category_id=$5, image=$6, updated_at=CURRENT_TIMESTAMP WHERE id=$7 RETURNING *",
      [name, description || '', price, stock, category_id, image || null, id]
    );

    if (result.rowCount === 0) {
      console.log('❌ [UPDATE] Product not found');
      return res.status(404).json({ message: "Product not found" });
    }

    console.log('✅ [UPDATE] Product updated successfully');
    res.json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (error) {
    console.error('❌ [UPDATE] Error:', error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Hapus produk berdasarkan ID (hanya admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID produk yang ingin dihapus
 *         schema:
 *           type: integer
 *           example: 4
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *       404:
 *         description: Produk tidak ditemukan
 */
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑 [DELETE] Deleting product ID:', id);
    
    const result = await pool.query("DELETE FROM products WHERE id=$1", [id]);
    
    if (result.rowCount === 0) {
      console.log('❌ [DELETE] Product not found');
      return res.status(404).json({ message: "Product not found" });
    }
    
    console.log('✅ [DELETE] Product deleted successfully');
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('❌ [DELETE] Error:', error.code, error.detail);
    
    // Foreign key constraint error
    if (error.code === '23503') {
      return res.status(400).json({ 
        message: "Produk tidak bisa dihapus karena masih ada transaksi yang menggunakan produk ini. Hubungi admin untuk bantuan lebih lanjut." 
      });
    }
    
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

module.exports = router;    