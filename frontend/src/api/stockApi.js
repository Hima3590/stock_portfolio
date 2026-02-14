import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_API_URL + '/stocks';

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

// Get portfolio overview (protected)
export const getPortfolioOverview = () => {
  return axiosInstance.get(`${API_URL}/portfolio/overview`)
    .then(res => res.data);
};

// Get portfolio stock info (protected)
export const getPortfolioStockInfo = (symbol) => {
  return axiosInstance.get(`${API_URL}/portfolio/${symbol}`)
    .then(res => res.data);
};
