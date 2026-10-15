// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
  headers: {
    Accept: "application/json",
  },
});

/* ---------- REQUEST INTERCEPTOR ---------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("spay_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Auto-set JSON content-type for non-FormData bodies
    if (config.data && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- RESPONSE INTERCEPTOR ---------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 401 — auto logout
    if (status === 401) {
      localStorage.removeItem("spay_token");
      localStorage.removeItem("spay_user");
      // Only redirect if we're inside the admin area
      if (window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    // Normalize error shape
    const payload = error?.response?.data || {};
    error.message =
      payload.message ||
      payload.error ||
      error.message ||
      "Network error";

    return Promise.reject(error);
  }
);

export default api;