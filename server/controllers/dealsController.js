const cheapsharkService = require('../services/cheapsharkService');

const getDeals = async (req, res) => {
  try {
    const params = req.query; // pass through query params like storeID, upperPrice, etc.
    const deals = await cheapsharkService.getDeals(params);
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch deals' });
  }
};

const getStores = async (req, res) => {
  try {
    const stores = await cheapsharkService.getStores();
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
};

module.exports = {
  getDeals,
  getStores
};
