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
 *               price:
 *                 type: number
 *                 example: 250000
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category_id:
 *                 type: integer
 *                 example: 1
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
    const { name, price, stock, category_id } = req.body;
    if (!name || !price || !stock || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await pool.query(
      "INSERT INTO products (name, price, stock, category_id) VALUES ($1, $2, $3, $4)",
      [name, price, stock, category_id]
    );

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    const { name, price, stock, category_id } = req.body;

    const result = await pool.query(
      "UPDATE products SET name=$1, price=$2, stock=$3, category_id=$4 WHERE id=$5",
      [name, price, stock, category_id, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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
    const result = await pool.query("DELETE FROM products WHERE id=$1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;    