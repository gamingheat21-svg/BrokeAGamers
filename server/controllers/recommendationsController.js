const db = require('../db');
const cheapsharkService = require('../services/cheapsharkService');
// For MVP, since we don't have RAWG full API, we'll just mock the compatibility filter
// In a real scenario we'd query RAWG for each deal's requirements.

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { maxPrice } = req.query; // budget
    
    // 1. Get User Specs
    const specResult = await db.query('SELECT * FROM user_specs WHERE user_id = $1', [userId]);
    if (specResult.rows.length === 0) {
      return res.status(400).json({ message: 'User specs not found. Please set up your specs first to get recommendations.' });
    }
    const userSpecs = specResult.rows[0];

    // 2. Fetch live deals
    const deals = await cheapsharkService.getDeals({ upperPrice: maxPrice || 50 });

    // 3. Filter Deals (Mock logic)
    // We will assume games with deal rating > 8.0 and that aren't too old will run if they have decent RAM.
    // In a real app we'd map each game to RAWG, check requirements against userSpecs.
    const recommendedDeals = deals.map(deal => {
      // Mock some compatibility badge
      const isHeavy = parseFloat(deal.normalPrice) > 40; // assume expensive games are heavy
      let status = '🟢 Can Run Smoothly';
      if (isHeavy && userSpecs.ram < 16) {
        status = '🟡 Can Run (Minimum Only)';
      }
      if (isHeavy && userSpecs.ram < 8) {
        status = '🔴 Won\'t Run';
      }
      
      return {
        ...deal,
        compatStatus: status
      };
    }).filter(deal => deal.compatStatus !== '🔴 Won\'t Run'); // Only show playable games

    // Sort by deal rating (Best deal score)
    recommendedDeals.sort((a, b) => b.dealRating - a.dealRating);

    res.json(recommendedDeals.slice(0, 20)); // Return top 20
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};

module.exports = {
  getRecommendations
};
