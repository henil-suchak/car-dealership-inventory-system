import axios from 'axios';

let currentToken = (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.getItem === 'function') ? window.localStorage.getItem('jwt_token') : null;

export const setToken = (token) => {
  currentToken = token;
  if (typeof window !== 'undefined' && window.localStorage && typeof window.localStorage.setItem === 'function') {
    if (token) {
      window.localStorage.setItem('jwt_token', token);
    } else {
      window.localStorage.removeItem('jwt_token');
    }
  }
};

const apiClient = axios.create({
  baseURL: '/api',
});

// Request Interceptor: Attach JWT to every request if available
apiClient.interceptors.request.use(
  (config) => {
    if (currentToken) {
      config.headers['Authorization'] = `Bearer ${currentToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global 401 Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // SEC-011: Clear in-memory token on 401
      setToken(null);
      // Optional: force reload or redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
