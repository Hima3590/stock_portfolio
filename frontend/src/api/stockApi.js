import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL + '/stocks';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addStock = async (data) =>
  (await axiosInstance.post(API_URL, data)).data;

export const getAllStocks = async () =>
  (await axiosInstance.get(API_URL)).data;

export const deleteStock = async (id) =>
  (await axiosInstance.delete(`${API_URL}/${id}`)).data;

export const updateStock = async (id, data) =>
  (await axiosInstance.put(`${API_URL}/${id}`, data)).data;

export const getStockSummary = async () =>
  (await axiosInstance.get(`${API_URL}/summary`)).data;

// Search stocks by symbol or name
export const searchStocks = (query) => {
  return axiosInstance.get(`${API_URL}/search`, { params: { q: query } })
    .then(res => res.data);
};

// Get live price (public)
export const getLivePrice = (symbol) => {
  return axiosInstance.get(`${API_URL}/price`, { params: { symbol } })
    .then(res => res.data);
};

// Get portfolio stock info (protected)
export const getPortfolioStockInfo = (symbol) => {
  return axiosInstance.get(`${API_URL}/portfolio/${symbol}`)
    .then(res => res.data);
};
