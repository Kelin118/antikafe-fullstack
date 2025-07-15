// src/utils/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// 🔐 Добавляем интерцептор запросов
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const companyId = localStorage.getItem('companyId');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 💡 Добавляем companyId в query параметры, если он есть и URL не содержит его
    const url = new URL(config.url, 'http://dummy-base');
    if (companyId && !url.searchParams.has('companyId')) {
      url.searchParams.set('companyId', companyId);
      config.url = url.pathname + url.search;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
s