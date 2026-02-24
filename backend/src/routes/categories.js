// =============================================================
// 📁 FILE: src/routes/categories.js
// 📚 Deskripsi:
//    Route untuk CRUD kategori pakaian.
//    Semua user bisa melihat data kategori,
//    tetapi hanya admin yang boleh menambah, ubah, dan hapus.
//    Dilengkapi dokumentasi Swagger untuk tampil di /api-docs.
// =============================================================

const express = require("express");
const router = express.Router();
const pool = require("../db/pool");
const authenticateToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API untuk mengelola kategori pakaian
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Ambil semua kategori (semua role)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua kategori
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
 *                     example: Kaos
 *                   description:
 *                     type: string
 *                     example: Pakaian santai untuk sehari-hari
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Ambil kategori berdasarkan ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori yang ingin dilihat
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detail kategori ditemukan
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.get("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Tambahkan kategori baru (hanya admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Kemeja
 *               description:
 *                 type: string
 *                 example: Pakaian formal untuk kerja
 *     responses:
 *       201:
 *         description: Kategori berhasil ditambahkan
 *       403:
 *         description: Hanya admin yang boleh menambah kategori
 */
router.post("/", authenticateToken, requireRole("admin"), async (req, res) => {
  const { name, description } = req.body;
  try {
    await pool.query("INSERT INTO categories (name, description) VALUES ($1, $2)", [name, description]);
    res.status(201).json({ message: "Category created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Ubah kategori berdasarkan ID (hanya admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori yang ingin diperbarui
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
 *               name:
 *                 type: string
 *                 example: Jaket
 *               description:
 *                 type: string
 *                 example: Pakaian luar untuk cuaca dingin
 *     responses:
 *       200:
 *         description: Kategori berhasil diperbarui
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.put("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated successfully", data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Hapus kategori berdasarkan ID (hanya admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID kategori yang ingin dihapus
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Kategori berhasil dihapus
 *       404:
 *         description: Kategori tidak ditemukan
 */
router.delete("/:id", authenticateToken, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM categories WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; 