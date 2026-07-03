const rawgService = require('../services/rawgService');
const cheapsharkService = require('../services/cheapsharkService');

const searchGames = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const cheapsharkResults = await cheapsharkService.searchGames(query);
    
    const results = cheapsharkResults.map(game => ({
      id: game.gameID,
      name: game.external,
      released: `Cheapest: $${game.cheapest}`,
      background_image: game.thumb
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search games' });
  }
};

const getGameDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get actual game details from Cheapshark
    const csGameDetails = await cheapsharkService.getGameDetails(id);
    
    // Fallback if game not found
    if (!csGameDetails || !csGameDetails.info) {
      return res.status(404).json({ message: 'Game not found' });
    }
    
    const stores = await cheapsharkService.getStores();
    
    // Map deals to include actual store names
    const mappedDeals = csGameDetails.deals.map(deal => {
      const storeInfo = stores.find(s => s.storeID === deal.storeID);
      return {
        store: storeInfo ? storeInfo.storeName : `Store ${deal.storeID}`,
        normalPrice: parseFloat(deal.retailPrice),
        salePrice: parseFloat(deal.price),
        savings: parseFloat(deal.savings)
      };
    });

    // Keeping mock requirements for now, but passing 1 to get something
    const reqs = await rawgService.getGameRequirements(1);
    
    res.json({
      id,
      name: csGameDetails.info.title,
      requirements: reqs,
      deals: mappedDeals
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get game details' });
  }
};

module.exports = {
  searchGames,
  getGameDetails
};
