import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {getData} from '../hooks/useAsyncStorage';

export const appName = 'Kinmarvel';

export const SOCKET_SERVER_URL = 'https://fameely-backend.onrender.com';
export const Google_Maps_Api_Key = `AIzaSyC8oQ4dsrPXmPNjJ85YO1KWzaVY2Lt7Uh4`;
export const fileViewURL =
  'https://fameely-backend.onrender.com/api/file/fetch/';

let isLive = false;
let testUrl =`https://fameely-api.deliciousdabbas.com/api`;
// let testUrl =`https://fameely-backend-973m.onrender.com/api`
export const baseUrl: string = isLive
  ? ''
  : testUrl;

// Standard Axios Instance
const API_AXIOS: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching the token
API_AXIOS.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const authToken = await getData('authToken');
    if (authToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export {API_AXIOS};

// Multipart Axios Instance
const API_AXIOS_MULTIPART: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 50000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor for attaching the token to multipart requests
API_AXIOS_MULTIPART.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    const authToken = await getData('authToken');
    if (authToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

export {API_AXIOS_MULTIPART};
