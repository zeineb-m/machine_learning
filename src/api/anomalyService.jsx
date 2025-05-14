import axios from 'axios';

const URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchAnomalyData = async () => {
  try {
    const response = await axios.get(`${URL}/api/anomaly/anomaly-detect`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching anomaly data:', error);
    throw error;
  }
};