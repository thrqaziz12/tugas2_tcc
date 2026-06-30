const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require('../controllers/notesController');

// Semua route catatan memerlukan autentikasi
router.use(verifyToken);

// POST   /api/notes        → Tambah catatan
router.post('/', createNote);

// GET    /api/notes        → Lihat semua catatan
router.get('/', getAllNotes);

// GET    /api/notes/:id    → Lihat detail catatan
router.get('/:id', getNoteById);

// PUT    /api/notes/:id    → Edit catatan
router.put('/:id', updateNote);

// DELETE /api/notes/:id    → Hapus catatan
router.delete('/:id', deleteNote);

module.exports = router;
