import axios from 'axios';

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

const rawgApi = axios.create({
  baseURL: BASE_URL,
  params: {
    key: RAWG_API_KEY
  }
});

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getGames = async (page = 1, pageSize = 12) => {
  try {
    const response = await rawgApi.get('/games', {
      params: {
        page,
        page_size: pageSize,
        ordering: '-rating'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const getGameDetails = async (gameId) => {
  try {
    const response = await rawgApi.get(`/games/${gameId}`, {
      params: {
        key: RAWG_API_KEY
      }
    });
    
    // Get stores data
    const storesResponse = await rawgApi.get(`/games/${gameId}/stores`, {
      params: {
        key: RAWG_API_KEY
      }
    });

    return {
      ...response.data,
      stores: storesResponse.data.results
    };
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

export const searchGames = async (searchQuery, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${RAWG_API_KEY}&search=${searchQuery}&page=${page}&page_size=20`
  );
  return handleResponse(response);
};

export const getGameScreenshots = async (gameId) => {
  const response = await fetch(
    `${BASE_URL}/games/${gameId}/screenshots?key=${RAWG_API_KEY}`
  );
  return handleResponse(response);
};

export const getGameTrailers = async (gameId) => {
  const response = await fetch(
    `${BASE_URL}/games/${gameId}/movies?key=${RAWG_API_KEY}`
  );
  return handleResponse(response);
};

export const getPopularGames = async (page = 1) => {
  const currentYear = new Date().getFullYear();
  const response = await fetch(
    `${BASE_URL}/games?key=${RAWG_API_KEY}&dates=${currentYear - 1}-01-01,${currentYear}-12-31&ordering=-added&page=${page}&page_size=20`
  );
  return handleResponse(response);
};

export const getUpcomingGames = async (page = 1) => {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date().getFullYear() + 1;
  const response = await fetch(
    `${BASE_URL}/games?key=${RAWG_API_KEY}&dates=${today},${nextYear}-12-31&ordering=released&page=${page}&page_size=20`
  );
  return handleResponse(response);
};

export const getGamesByGenre = async (genreId, page = 1) => {
  const response = await fetch(
    `${BASE_URL}/games?key=${RAWG_API_KEY}&genres=${genreId}&page=${page}&page_size=20`
  );
  return handleResponse(response);
};

export const getGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genres?key=${RAWG_API_KEY}`
  );
  return handleResponse(response);
}; 