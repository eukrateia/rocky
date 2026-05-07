import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = await axios.post("http://localhost:5000/api/auth/refresh", {}, { withCredentials: true });
      setAccessToken(refresh.data.accessToken);
      original.headers.Authorization = `Bearer ${refresh.data.accessToken}`;
      return api(original);
    }
    return Promise.reject(error);
  }
);
