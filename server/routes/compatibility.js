const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { checkCompatibility } = require('../controllers/compatibilityController');

router.get('/check/:gameId', authMiddleware, checkCompatibility);

module.exports = router;
