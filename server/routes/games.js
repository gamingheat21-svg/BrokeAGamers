const express = require('express');
const router = express.Router();
const { searchGames, getGameDetails } = require('../controllers/gamesController');

router.get('/search', searchGames);
router.get('/:id', getGameDetails);

module.exports = router;
