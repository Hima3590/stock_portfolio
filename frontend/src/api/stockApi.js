import axios from 'axios';



const API_URL = process.env.REACT_APP_API_URL;


export const addStock = async (stockData) => {
  const response = await axios.post(API_URL, stockData);
  return response.data;
};

export const getAllStocks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const deleteStock = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  };

  export const updateStock = async (id, stockData) => {
    const response = await axios.put(`${API_URL}/${id}`, stockData);
    return response.data;
  };
