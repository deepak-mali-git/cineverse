
import axios from 'axios'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
  },
});

export default api;
