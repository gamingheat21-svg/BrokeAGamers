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
  { dealID: "m5", gameID: "g5", title: "Stardew Valley", salePrice: "11.99", normalPrice: "14.99", savings: "20.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg", storeID: "1", metacriticScore: "89", steamRatingPercent: "98" },
  { dealID: "m6", gameID: "g6", title: "Baldur's Gate 3", salePrice: "47.99", normalPrice: "59.99", savings: "20.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg", storeID: "1", metacriticScore: "96", steamRatingPercent: "95" },
  { dealID: "m7", gameID: "g7", title: "Elden Ring", salePrice: "35.99", normalPrice: "59.99", savings: "40.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg", storeID: "1", metacriticScore: "94", steamRatingPercent: "92" },
  { dealID: "m8", gameID: "g8", title: "Hades", salePrice: "8.49", normalPrice: "24.99", savings: "66.03", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145360/header.jpg", storeID: "1", metacriticScore: "93", steamRatingPercent: "98" },
  { dealID: "m9", gameID: "g9", title: "Dead Cells", salePrice: "12.49", normalPrice: "24.99", savings: "50.02", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/588650/header.jpg", storeID: "1", metacriticScore: "89", steamRatingPercent: "97" },
  { dealID: "m10", gameID: "g10", title: "Celeste", salePrice: "4.99", normalPrice: "19.99", savings: "75.04", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/504230/header.jpg", storeID: "1", metacriticScore: "94", steamRatingPercent: "97" },
  { dealID: "m11", gameID: "g11", title: "Terraria", salePrice: "4.99", normalPrice: "9.99", savings: "50.05", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/105600/header.jpg", storeID: "1", metacriticScore: "83", steamRatingPercent: "98" },
  { dealID: "m12", gameID: "g12", title: "Disco Elysium", salePrice: "9.99", normalPrice: "39.99", savings: "75.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/632470/header.jpg", storeID: "7", metacriticScore: "97", steamRatingPercent: "92" },
  { dealID: "m13", gameID: "g13", title: "DOOM Eternal", salePrice: "9.99", normalPrice: "39.99", savings: "75.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg", storeID: "1", metacriticScore: "88", steamRatingPercent: "91" },
  { dealID: "m14", gameID: "g14", title: "Control Ultimate Edition", salePrice: "7.99", normalPrice: "39.99", savings: "80.02", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/870780/header.jpg", storeID: "1", metacriticScore: "85", steamRatingPercent: "89" },
  { dealID: "m15", gameID: "g15", title: "Mass Effect Legendary Edition", salePrice: "8.99", normalPrice: "59.99", savings: "85.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1328670/header.jpg", storeID: "1", metacriticScore: "86", steamRatingPercent: "91" },
  { dealID: "m16", gameID: "g16", title: "No Man's Sky", salePrice: "23.99", normalPrice: "59.99", savings: "60.01", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/275850/header.jpg", storeID: "1", metacriticScore: "71", steamRatingPercent: "80" }
];
const MOCK_FREE_DEALS = [
  { dealID: "free1", gameID: "free-g1", title: "Destiny 2", salePrice: "0.00", normalPrice: "19.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1085660/header.jpg", storeID: "1", metacriticScore: "83", steamRatingPercent: "80" },
  { dealID: "free2", gameID: "free-g2", title: "Warframe", salePrice: "0.00", normalPrice: "29.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/230410/header.jpg", storeID: "1", metacriticScore: "69", steamRatingPercent: "87" },
  { dealID: "free3", gameID: "free-g3", title: "The Sims 4", salePrice: "0.00", normalPrice: "39.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222670/header.jpg", storeID: "1", metacriticScore: "70", steamRatingPercent: "87" },
  { dealID: "free4", gameID: "free-g4", title: "Apex Legends", salePrice: "0.00", normalPrice: "19.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/header.jpg", storeID: "1", metacriticScore: "88", steamRatingPercent: "78" },
  { dealID: "free5", gameID: "free-g5", title: "Dota 2", salePrice: "0.00", normalPrice: "29.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/header.jpg", storeID: "1", metacriticScore: "90", steamRatingPercent: "81" },
  { dealID: "free6", gameID: "free-g6", title: "Path of Exile", salePrice: "0.00", normalPrice: "29.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/238960/header.jpg", storeID: "1", metacriticScore: "86", steamRatingPercent: "88" },
  { dealID: "free7", gameID: "free-g7", title: "Counter-Strike 2", salePrice: "0.00", normalPrice: "14.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/header.jpg", storeID: "1", metacriticScore: "82", steamRatingPercent: "87" },
  { dealID: "free8", gameID: "free-g8", title: "Team Fortress 2", salePrice: "0.00", normalPrice: "19.99", savings: "100.00", thumb: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/440/header.jpg", storeID: "1", metacriticScore: "92", steamRatingPercent: "93" }
];


const ALL_MOCK_DEALS = [...MOCK_DEALS, ...MOCK_FREE_DEALS];

const getMockGameDetails = (id) => {
  const deal = ALL_MOCK_DEALS.find(item => item.gameID === id);
  if (!deal) return null;

  return {
    info: {
      title: deal.title,
      thumb: deal.thumb
    },
    cheapestPriceEver: {
      price: deal.salePrice
    },
    deals: [
      {
        storeID: deal.storeID,
        retailPrice: deal.normalPrice,
        price: deal.salePrice,
        savings: deal.savings
      }
    ]
  };
};
const wantsFreeDeals = (params = {}) => Number(params.upperPrice) === 0;

const paginateFallback = (deals, params = {}) => {
  const pageSize = Number(params.pageSize) || deals.length;
  const pageNumber = Number(params.pageNumber) || 0;
  const start = pageNumber * pageSize;
  return deals.slice(start, start + pageSize);
};
const getDeals = async (params = {}) => {
  try {
    const apiParams = { pageSize: 60, ...params };
    if (apiParams.minRating) {
      apiParams.onSale = 1;
      apiParams.minSteamRating = apiParams.minRating; 
      delete apiParams.minRating;
    }
    const response = await axiosInstance.get('/deals', { params: apiParams });
    if (wantsFreeDeals(params) && response.data.length === 0) {
      return paginateFallback(MOCK_FREE_DEALS, params);
    }
    return response.data;
  } catch (error) {
    console.warn('CheapShark API unreachable, returning mock deals.');
    return paginateFallback(wantsFreeDeals(params) ? MOCK_FREE_DEALS : MOCK_DEALS, params);
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
  const mockDetails = getMockGameDetails(id);
  if (mockDetails) return mockDetails;

  try {
    const response = await axiosInstance.get('/games', { 
      params: { id }
    });
    return response.data;
  } catch (error) {
    console.warn('CheapShark API unreachable, returning mock game detail.');
    return null;
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
