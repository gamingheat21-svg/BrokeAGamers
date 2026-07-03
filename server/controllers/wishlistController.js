const db = require('../db');
const axios = require('axios');

const getWishlist = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT w.*, g.title as game_title 
       FROM wishlist w 
       LEFT JOIN games_cache g ON w.game_id = g.game_id 
       WHERE w.user_id = $1 ORDER BY w.added_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { gameId, targetPrice, title } = req.body;
    const userId = req.user.id;

    // Check if game already in wishlist
    const existResult = await db.query('SELECT id FROM wishlist WHERE user_id = $1 AND game_id = $2', [userId, gameId]);
    if (existResult.rows.length > 0) {
      return res.status(400).json({ message: 'Game already in wishlist' });
    }

    // Insert into games_cache if not exists to save title
    await db.query(
      'INSERT INTO games_cache (game_id, title) VALUES ($1, $2) ON CONFLICT (game_id) DO NOTHING',
      [gameId, title || `Game #${gameId}`]
    );

    // Insert into wishlist
    const result = await db.query(
      'INSERT INTO wishlist (user_id, game_id, target_price) VALUES ($1, $2, $3) RETURNING *',
      [userId, gameId, targetPrice]
    );

    // Get user email
    const userResult = await db.query('SELECT email FROM users WHERE id = $1', [userId]);
    const userEmail = userResult.rows[0].email;

    // Set CheapShark price alert
    if (targetPrice) {
      try {
        await axios.get(`https://www.cheapshark.com/api/1.0/alerts?action=set&email=${encodeURIComponent(userEmail)}&gameID=${gameId}&price=${targetPrice}`);
        console.log(`Alert set for ${userEmail} on game ${gameId} at $${targetPrice}`);
      } catch (alertErr) {
        console.error('Failed to set CheapShark alert', alertErr.message);
      }
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    await db.query('DELETE FROM wishlist WHERE user_id = $1 AND game_id = $2', [userId, gameId]);

    // Optionally delete from CheapShark alert using action=delete

    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove wishlist error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
