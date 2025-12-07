import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all cryptocurrency prices
export const getAllPrices = async () => {
  try {
    const response = await axios.get(`${API_URL}/prices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
};

// Get single cryptocurrency price
export const getSinglePrice = async (symbol) => {
  try {
    const response = await axios.get(`${API_URL}/prices/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    throw error;
  }
};

// Refresh all prices (requires authentication)
export const refreshPrices = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/prices/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error refreshing prices:', error);
    throw error;
  }
};
