import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get user settings
export const getSettings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Update user settings
export const updateSettings = async (settings, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/settings`,
      settings,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}; 