// =============================================================
// 📁 FILE: src/routes/users.js
// 📚 Deskripsi:
//    API untuk mengelola status user (aktif/nonaktif) dan profil.
//    Hanya admin yang dapat mengubah status akun,
//    sedangkan semua user bisa melihat profil dirinya.
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
 *   name: Users
 *   description: API untuk manajemen akun pengguna (Admin & Kasir)
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Melihat profil user yang sedang login
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Revandra Saputra
 *                 username:
 *                   type: string
 *                   example: revandra
 *                 role:
 *                   type: string
 *                   example: kasir
 *                 is_active:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token tidak valid atau belum login
 */
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user; // id diambil dari token JWT

    const result = await pool.query("SELECT id, name, username, role, is_active FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

/**
 * @swagger
 * /users/deactivate-user:
 *   put:
 *     summary: Nonaktifkan akun user berdasarkan ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Akun user berhasil dinonaktifkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with ID 3 deactivated successfully
 *       400:
 *         description: ID user tidak dikirim di body request
 *       403:
 *         description: Akses ditolak (bukan admin)
 *       404:
 *         description: User tidak ditemukan
 */
router.put("/deactivate-user", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await pool.query(
      "UPDATE users SET is_active = FALSE WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `User with ID ${id} deactivated successfully` });
  } catch (error) {
    console.error("Deactivate user error:", error.message);
    res.status(500).json({ message: "Error deactivating user" });
  }
});

/**
 * @swagger
 * /users/activate-user:
 *   put:
 *     summary: Aktifkan kembali akun user berdasarkan ID (admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Akun user berhasil diaktifkan kembali
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User with ID 3 activated successfully
 *       400:
 *         description: ID user tidak dikirim di body request
 *       403:
 *         description: Akses ditolak (bukan admin)
 *       404:
 *         description: User tidak ditemukan
 */
router.put("/activate-user", authenticateToken, requireRole("admin"), async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await pool.query(
      "UPDATE users SET is_active = TRUE WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: `User with ID ${id} activated successfully` });
  } catch (error) {
    console.error("Activate user error:", error.message);
    res.status(500).json({ message: "Error activating user" });
  }
});

module.exports = router;
