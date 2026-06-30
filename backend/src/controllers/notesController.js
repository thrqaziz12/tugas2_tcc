const pool = require('../database/db');

// Tambah catatan
const createNote = async (req, res) => {
  const { judul, isi } = req.body;
  const user_id = req.user.id;

  if (!judul || !isi) {
    return res.status(400).json({ success: false, message: 'Judul dan isi catatan wajib diisi.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO notes (user_id, judul, isi) VALUES (?, ?, ?)',
      [user_id, judul, isi]
    );

    const [newNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [result.insertId]);

    return res.status(201).json({
      success: true,
      message: 'Catatan berhasil ditambahkan.',
      data: newNote[0]
    });
  } catch (err) {
    console.error('Error createNote:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// Lihat semua catatan milik user yang sedang login
const getAllNotes = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [notes] = await pool.query(
      'SELECT * FROM notes WHERE user_id = ? ORDER BY tanggal_dibuat DESC',
      [user_id]
    );

    return res.status(200).json({
      success: true,
      message: 'Daftar catatan berhasil diambil.',
      data: notes
    });
  } catch (err) {
    console.error('Error getAllNotes:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// Lihat detail satu catatan
const getNoteById = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [notes] = await pool.query(
      'SELECT * FROM notes WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (notes.length === 0) {
      return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Detail catatan berhasil diambil.',
      data: notes[0]
    });
  } catch (err) {
    console.error('Error getNoteById:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// Edit catatan
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { judul, isi } = req.body;
  const user_id = req.user.id;

  if (!judul || !isi) {
    return res.status(400).json({ success: false, message: 'Judul dan isi catatan wajib diisi.' });
  }

  try {
    // Pastikan catatan milik user yang login
    const [existing] = await pool.query(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan atau bukan milik Anda.' });
    }

    await pool.query(
      'UPDATE notes SET judul = ?, isi = ? WHERE id = ? AND user_id = ?',
      [judul, isi, id, user_id]
    );

    const [updatedNote] = await pool.query('SELECT * FROM notes WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Catatan berhasil diperbarui.',
      data: updatedNote[0]
    });
  } catch (err) {
    console.error('Error updateNote:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// Hapus catatan
const deleteNote = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Pastikan catatan milik user yang login
    const [existing] = await pool.query(
      'SELECT id FROM notes WHERE id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Catatan tidak ditemukan atau bukan milik Anda.' });
    }

    await pool.query('DELETE FROM notes WHERE id = ? AND user_id = ?', [id, user_id]);

    return res.status(200).json({
      success: true,
      message: 'Catatan berhasil dihapus.'
    });
  } catch (err) {
    console.error('Error deleteNote:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = { createNote, getAllNotes, getNoteById, updateNote, deleteNote };
