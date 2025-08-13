import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/accounts") {
        window.location.href = "/accounts";
      }
    }

    const message =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Request Failed";
    return Promise.reject(new Error(message));
  }
);
