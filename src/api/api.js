import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach Bearer token
api.interceptors.request.use(
  (config) => {
    // If we are currently navigating the admin portal, use adminToken, else use accessToken
    const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
    const token = localStorage.getItem(isAdminRoute ? 'adminToken' : 'accessToken');
    
    // Only add token if it exists AND the URL is NOT an auth endpoint
    if (token && !config.url.includes('/api/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag to prevent multiple refresh attempts simultaneously
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor — handle 401 with refresh token retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      const refreshTokenKey = isAdminRoute ? 'adminRefreshToken' : 'refreshToken';
      const accessTokenKey = isAdminRoute ? 'adminToken' : 'accessToken';
      const loginRedirectPath = isAdminRoute ? '/admin/login' : '/login';

      const refreshToken = localStorage.getItem(refreshTokenKey);

      // No refresh token available — redirect to login
      if (!refreshToken) {
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
        window.location.href = loginRedirectPath;
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await axios.post('http://localhost:8080/api/auth/refreshToken', {
          token: refreshToken,
        });

        const { accessToken: newAccessToken, token: newRefreshToken } = response.data;

        if (newAccessToken) {
          localStorage.setItem(accessTokenKey, newAccessToken);
        }
        if (newRefreshToken) {
          localStorage.setItem(refreshTokenKey, newRefreshToken);
        }

        // Update the failed request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        processQueue(refreshError, null);
        localStorage.removeItem(accessTokenKey);
        localStorage.removeItem(refreshTokenKey);
        window.location.href = loginRedirectPath;
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
