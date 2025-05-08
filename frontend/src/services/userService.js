import axios from 'axios';

// In React, environment variables must be prefixed with REACT_APP_
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Upload profile picture
export const uploadProfilePicture = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);

    const response = await axios.post(
      `${API_URL}/users/profile-picture`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error.response?.data || error.message);
    throw error;
  }
};

// Update user profile
export const updateProfile = async (profileData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/profile`,
      profileData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error.message);
    throw error;
  }
}; 