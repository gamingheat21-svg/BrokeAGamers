const db = require('../db');

const getSpecs = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM user_specs WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.json(null); // No specs set yet
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get specs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const saveSpecs = async (req, res) => {
  try {
    const { gpu, cpu, ram, os, directx } = req.body;
    const userId = req.user.id;

    // Check if specs already exist
    const existResult = await db.query('SELECT id FROM user_specs WHERE user_id = $1', [userId]);

    let result;
    if (existResult.rows.length > 0) {
      // Update
      result = await db.query(
        'UPDATE user_specs SET gpu = $1, cpu = $2, ram = $3, os = $4, directx = $5 WHERE user_id = $6 RETURNING *',
        [gpu, cpu, ram, os, directx, userId]
      );
    } else {
      // Insert
      result = await db.query(
        'INSERT INTO user_specs (user_id, gpu, cpu, ram, os, directx) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, gpu, cpu, ram, os, directx]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Save specs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSpecs,
  saveSpecs
};
