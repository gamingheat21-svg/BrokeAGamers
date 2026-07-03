const axios = require('axios');

const CHEAPSHARK_BASE_URL = 'https://www.cheapshark.com/api/1.0';

const axiosInstance = axios.create({
  baseURL: CHEAPSHARK_BASE_URL,
  headers: {
    'User-Agent': 'GameDealHunt/1.0 (contact@brokeagamer.com)'
  }
});

const MOCK_STORES = [
  { storeID: "1", storeName: "Steam", isActive: 1 },
  { storeID: "2", storeName: "GamersGate", isActive: 1 },
  { storeID: "3", storeName: "GreenManGaming", isActive: 1 },
  { storeID: "7", storeName: "GOG", isActive: 1 },
  { storeID: "11", storeName: "Humble Store", isActive: 1 },
  { storeID: "25", storeName: "Epic Games", isActive: 1 }
];

const MOCK_DEALS = [
  { dealID: "m1", gameID: "g1", title: "Cyberpunk 2077", salePrice: "29.99", normalPrice: "59.99", savings: "50.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg", storeID: "1", metacriticScore: "86", steamRatingPercent: "83" },
  { dealID: "m2", gameID: "g2", title: "The Witcher 3: Wild Hunt", salePrice: "9.99", normalPrice: "39.99", savings: "75.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg", storeID: "7", metacriticScore: "93", steamRatingPercent: "96" },
  { dealID: "m3", gameID: "g3", title: "Red Dead Redemption 2", salePrice: "19.79", normalPrice: "59.99", savings: "67.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg", storeID: "25", metacriticScore: "93", steamRatingPercent: "91" },
  { dealID: "m4", gameID: "g4", title: "Hollow Knight", salePrice: "7.49", normalPrice: "14.99", savings: "50.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg", storeID: "1", metacriticScore: "87", steamRatingPercent: "97" },
  { dealID: "m5", gameID: "g5", title: "Stardew Valley", salePrice: "11.99", normalPrice: "14.99", savings: "20.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg", storeID: "1", metacriticScore: "89", steamRatingPercent: "98" }
];

const MOCK_FREE_DEALS = [
  { dealID: "free1", gameID: "free-g1", title: "Destiny 2", salePrice: "0.00", normalPrice: "19.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1085660/header.jpg", storeID: "1", metacriticScore: "83", steamRatingPercent: "80" },
  { dealID: "free2", gameID: "free-g2", title: "Warframe", salePrice: "0.00", normalPrice: "29.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/230410/header.jpg", storeID: "1", metacriticScore: "69", steamRatingPercent: "87" },
  { dealID: "free3", gameID: "free-g3", title: "The Sims 4", salePrice: "0.00", normalPrice: "39.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222670/header.jpg", storeID: "1", metacriticScore: "70", steamRatingPercent: "87" }
];

const wantsFreeDeals = (params = {}) => Number(params.upperPrice) === 0;
const getDeals = async (params = {}) => {
  try {
    const apiParams = { ...params };
    if (apiParams.minRating) {
      apiParams.onSale = 1;
      apiParams.minSteamRating = apiParams.minRating; 
      delete apiParams.minRating;
    }
    const response = await axiosInstance.get('/deals', { params: apiParams });
    if (wantsFreeDeals(params) && response.data.length === 0) {
      return MOCK_FREE_DEALS;
    }
    return response.data;
  } catch (error) {
    console.warn('CheapShark API unreachable, returning mock deals.');
    return wantsFreeDeals(params) ? MOCK_FREE_DEALS : MOCK_DEALS;
  }
};

const searchGames = async (query) => {
  try {
    const response = await axiosInstance.get('/games', { 
      params: { title: query, limit: 20 }
    });
    return response.data;
  } catch (error) {
    console.warn('CheapShark API unreachable, returning empty games list.');
    return [];
  }
};

const getGameDetails = async (id) => {
  try {
    const response = await axiosInstance.get('/games', { 
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.warn('CheapShark API unreachable, returning mock game detail.');
    return { info: { title: "Mock Game", thumb: "" }, cheapestPriceEver: { price: "0.00" }, deals: [] };
  }
};

const getStores = async () => {
  try {
    const response = await axiosInstance.get('/stores');
    return response.data;
  } catch (error) {
    console.warn('CheapShark API unreachable, returning mock stores.');
    return MOCK_STORES;
  }
};

module.exports = {
  getDeals,
  getStores,
  searchGames,
  getGameDetails
};
