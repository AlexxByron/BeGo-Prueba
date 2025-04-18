import axios from 'axios';

const API_BASE = 'https://129bc152-6319-4e38-b755-534a4ee46195.mock.pstmn.io/orders';

export const getUpcomingOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/upcoming`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data;
  } catch (error) {
  }
};
