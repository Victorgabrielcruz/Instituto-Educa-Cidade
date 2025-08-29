import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const requestToken = token ? token : "";
  config.headers.Authorization = requestToken;
  return config;
});

export default api;
