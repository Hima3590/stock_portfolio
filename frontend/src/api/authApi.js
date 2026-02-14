import axiosInstance from './axiosInstance';

const API_URL = process.env.REACT_APP_AUTH_API;

export const registerUser = async (userData) => {
  const res = await axiosInstance.post(`${API_URL}/register`, userData);
  return res.data;
};

export const loginUser = async (userData) => {
  const res = await axiosInstance.post(`${API_URL}/login`, userData);
  return res.data;
};
