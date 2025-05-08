import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api';

export const searchDeals = async (gameTitle) => {
  try {
    const response = await axios.get(`${BASE_URL}/deals`, {
      params: {
        title: gameTitle,
        limit: 5,
        sortBy: 'Price',
        desc: 0
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
};

export const getGameDeals = async (gameId) => {
  try {
    const response = await axios.get(`${BASE_URL}/games`, {
      params: {
        id: gameId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching game deals:', error);
    return null;
  }
};

export const getDealInfo = async (dealId) => {
  try {
    const response = await axios.get(`${BASE_URL}/deal`, {
      params: {
        id: dealId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching deal info:', error);
    return null;
  }
};

export const getStores = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/stores`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    return [];
  }
}; 