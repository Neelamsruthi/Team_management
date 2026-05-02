import axios from "axios";

const api = axios.create({
  baseURL: //"http://localhost:8000"
  "https://teammanagement-production-2074.up.railway.app"
});

// ADD TOKEN AUTOMATICALLY
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default api;