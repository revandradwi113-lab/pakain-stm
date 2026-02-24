// =============================================================
// 📁 FILE: src/routes/transactions.js
// 📚 Deskripsi:
//    API untuk mengelola transaksi penjualan pakaian.
//    Hanya kasir yang dapat membuat, melihat, dan mengubah transaksi.
//    Dilengkapi dokumentasi Swagger untuk tampilan di /api-docs.
// =============================================================

const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const authenticateToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API untuk mengelola transaksi penjualan (Kasir Only)
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Ambil semua transaksi (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar transaksi berhasil diambil
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
 *                   total:
 *                     type: number
 *                     example: 250000
 *                   created_at:
 *                     type: string
 *                     example: "2025-10-17T09:00:00.000Z"
 *                   username:
 *                     type: string
 *                     example: "kasir1"
 */
router.get("/", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT t.*, u.name, u.email 
       FROM transactions t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Ambil detail transaksi berdasarkan ID (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID transaksi yang ingin dilihat
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detail transaksi berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     total:
 *                       type: number
 *                       example: 250000
 *                     created_at:
 *                       type: string
 *                       example: "2025-10-17T09:00:00.000Z"
 *                     username:
 *                       type: string
 *                       example: "kasir1"
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_name:
 *                         type: string
 *                         example: Kaos Polos
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       subtotal:
 *                         type: number
 *                         example: 150000
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.get("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT t.*, u.name, u.email 
       FROM transactions t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = $1`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Transaction not found" });

    const items = await pool.query(
      `SELECT ti.*, p.name AS product_name 
       FROM transaction_items ti 
       JOIN products p ON ti.product_id = p.id 
       WHERE ti.transaction_id = $1`,
      [id]
    );

    res.json({ transaction: rows[0], items: items.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Buat transaksi baru (kasir only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 2
 *                     quantity:
 *                       type: integer
 *                       example: 3
 *                     price:
 *                       type: number
 *                       example: 75000
 *     responses:
 *       200:
 *         description: Transaksi berhasil dibuat
 *       400:
 *         description: Data item tidak lengkap
 */
router.post("/", authenticateToken, requireRole("kasir", "admin"), async (req, res) => {
  const client = await pool.connect();
  try {
    const { items } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: "Items required" });

    await client.query("BEGIN");

    // Hitung total transaksi
    let total = 0;
    for (const i of items) total += i.quantity * i.price;

    // Simpan ke tabel transaksi
    const tx = await client.query(
      "INSERT INTO transactions (user_id, total) VALUES ($1, $2) RETURNING id",
      [req.user.id, total]
    );
    const transaction_id = tx.rows[0].id;

    // Simpan ke tabel transaction_items
    for (const item of items) {
      await client.query(
        "INSERT INTO transaction_items (transaction_id, product_id, quantity, subtotal) VALUES ($1, $2, $3, $4)",
        [
          transaction_id,
          item.product_id,
          item.quantity,
          item.quantity * item.price,
        ]
      );

      // Kurangi stok produk
      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");

    res.json({ message: "Transaction completed", transaction_id });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update total transaksi berdasarkan ID (kasir only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID transaksi yang ingin diperbarui
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total:
 *                 type: number
 *                 example: 200000
 *     responses:
 *       200:
 *         description: Transaksi berhasil diperbarui
 *       404:
 *         description: Transaksi tidak ditemukan
 */
router.put("/:id", authenticateToken, requireRole("kasir"), async (req, res) => {
  try {
    const { id } = req.params;
    const { total } = req.body;

    const result = await pool.query(
      "UPDATE transactions SET total = $1 WHERE id = $2",
      [total, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ message: "Transaction not found" });

    res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
