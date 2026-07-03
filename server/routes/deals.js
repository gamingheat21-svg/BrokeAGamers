const express = require('express');
const router = express.Router();
const { getDeals, getStores } = require('../controllers/dealsController');

router.get('/', getDeals);
router.get('/stores', getStores);

module.exports = router;
