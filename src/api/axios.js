import axios, { AxiosHeaders } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

export const TOKEN_KEY = 'secure_notes_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

/**
 * Request interceptor
 * -------------------
 * Adds `Authorization: Bearer <token>` to every request once a JWT is
 * available, and keeps the Content-Type handling safe (FormData bodies must
 * not be forced to JSON or the file is dropped).
 */
api.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData;

  const headers = AxiosHeaders.from(config.headers);

  if (isFormData) {
    // Let the browser set the multipart boundary.
    headers.delete('Content-Type');
  } else if (config.data !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  config.headers = headers;

  return config;
});

/**
 * Response interceptor
 * --------------------
 * A 401 means the stored token is missing/expired — clear it so the app
 * falls back to the login screen instead of looping on failed requests.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(error);
  }
);

export { API_BASE };
export default api;