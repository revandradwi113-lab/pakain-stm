// =============================================================
// 📁 FILE: src/routes/auth.js
// =============================================================

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const authenticateToken = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
require("dotenv").config();

let refreshTokens = [];

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API untuk autentikasi (Login, Register, Refresh Token, Logout)
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Daftarkan user baru (hanya admin)
 *     tags: [Auth]
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
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: Revandra Saputra
 *               email:
 *                 type: string
 *                 example: revandra@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, kasir]
 *                 example: kasir
 *     responses:
 *       200:
 *         description: User berhasil terdaftar
 *       400:
 *         description: Email sudah terdaftar atau field tidak lengkap
 *       403:
 *         description: Hanya admin yang boleh mendaftarkan user
 */
router.post(
  "/register",
  async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const checkUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (checkUser.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // 🔐 HASH PASSWORD
      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)",
        [name, email, hashedPassword, role, true]
      );

      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user dengan email dan password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: revandra@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Email tidak ditemukan atau password salah
 *       403:
 *         description: Akun sudah dinonaktifkan
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 BANDINGAN PASSWORD
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    refreshTokens.push(refreshToken);

    res.json({
      message: "Login successful",
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Dapatkan token baru menggunakan refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Token baru berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Refresh token tidak diberikan
 *       403:
 *         description: Refresh token tidak valid atau sudah expired
 */
router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const newToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token: newToken });
  });
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user (invalidate refresh token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Logout berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: Refresh token tidak diberikan
 */
router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  refreshTokens = refreshTokens.filter((t) => t !== refreshToken);
  res.json({ message: "Logged out successfully" });
});

/**
 * @swagger
 * /auth/register-customer:
 *   post:
 *     summary: Daftarkan kasir baru (publik, tanpa perlu token) - untuk dashboard kasir
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Kasir berhasil terdaftar dengan role kasir
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Customer registered successfully
 *       400:
 *         description: Email sudah terdaftar atau field tidak lengkap
 */
router.post("/register-customer", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  try {
    // Cek apakah email sudah terdaftar
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database dengan role kasir agar dapat melakukan transaksi
    await pool.query(
      "INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5)",
      [name, email, hashedPassword, "kasir", true]
    );

    res.json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error("Register customer error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ message: "Registrasi gagal: " + error.message });
  }
});

module.exports = router;
