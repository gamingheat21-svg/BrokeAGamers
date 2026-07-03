// Mock service until RAWG API key is provided
const searchGames = async (query) => {
  console.log(`Mock RAWG Search: ${query}`);
  return [
    {
      id: 1,
      name: "Cyberpunk 2077",
      released: "2020-12-10",
      background_image: "https://via.placeholder.com/600x400?text=Cyberpunk",
    },
    {
      id: 2,
      name: "Stardew Valley",
      released: "2016-02-26",
      background_image: "https://via.placeholder.com/600x400?text=Stardew",
    }
  ];
};

const getGameRequirements = async (gameId) => {
  console.log(`Mock RAWG Requirements for ID: ${gameId}`);
  if (gameId == 1) {
    return {
      minimum: {
        os: "Windows 10",
        processor: "Intel Core i5-3570K or AMD FX-8310",
        memory: "8 GB RAM",
        graphics: "NVIDIA GeForce GTX 970 or AMD Radeon RX 470",
        directx: "Version 12"
      },
      recommended: {
        os: "Windows 10",
        processor: "Intel Core i7-4790 or AMD Ryzen 3 3200G",
        memory: "12 GB RAM",
        graphics: "GTX 1060 6GB / GTX 1660 Super or Radeon RX 590",
        directx: "Version 12"
      }
    };
  }
  
  return {
    minimum: {
      os: "Windows Vista or greater",
      processor: "2 Ghz",
      memory: "2 GB RAM",
      graphics: "256 mb video memory, shader model 3.0+",
      directx: "Version 10"
    },
    recommended: null
  };
};

module.exports = {
  searchGames,
  getGameRequirements
};
