const axios = require('axios');

const CHEAPSHARK_BASE_URL = 'https://www.cheapshark.com/api/1.0';

const getDeals = async (params = {}) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE_URL}/deals`, { params });
    return response.data;
  } catch (error) {
    console.error('CheapShark getDeals error:', error.message);
    throw error;
  }
};

const searchGames = async (query) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE_URL}/games`, { 
      params: { title: query, limit: 20 }
    });
    return response.data;
  } catch (error) {
    console.error('CheapShark searchGames error:', error.message);
    throw error;
  }
};

const getGameDetails = async (id) => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE_URL}/games`, { 
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.error('CheapShark getGameDetails error:', error.message);
    throw error;
  }
};

const getStores = async () => {
  try {
    const response = await axios.get(`${CHEAPSHARK_BASE_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error('CheapShark getStores error:', error.message);
    throw error;
  }
};

module.exports = {
  getDeals,
  getStores,
  searchGames,
  getGameDetails
};
