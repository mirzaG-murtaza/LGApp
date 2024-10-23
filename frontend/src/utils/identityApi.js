import axios from "axios";

const identityApi = axios.create({
  // baseURL: "http://localhost:8081/auth",
  baseURL: 'http://67.205.128.51:8081/auth',
});

identityApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default identityApi;
