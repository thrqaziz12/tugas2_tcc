const jwt = require('jsonwebtoken');
const { getTokenBlacklist } = require('../controllers/authController');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  // Cek apakah token sudah di-blacklist (sudah logout)
  const blacklist = getTokenBlacklist();
  if (blacklist.has(token)) {
    return res.status(401).json({ success: false, message: 'Token sudah tidak valid. Silakan login kembali.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Token tidak valid atau sudah kadaluarsa.' });
  }
};

module.exports = verifyToken;
