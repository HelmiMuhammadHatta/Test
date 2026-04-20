import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Sesuaikan dengan port backend kamu
});

// Tambahkan interceptor untuk menyisipkan token jika ada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;