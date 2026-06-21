import axios from "axios";

const api = axios.create({
  baseURL: "/api/news",
});

export async function fetchNewsList(page = 1, limit = 20) {
  const response = await api.get("/", { params: { page, limit } });
  return response.data; // { news, pagination }
}

export async function fetchNewsById(id) {
  const response = await api.get(`/${id}`);
  return response.data.news;
}

export default api;