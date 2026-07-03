const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getSpecs, saveSpecs } = require('../controllers/specsController');

router.get('/', authMiddleware, getSpecs);
router.post('/', authMiddleware, saveSpecs);

module.exports = router;
