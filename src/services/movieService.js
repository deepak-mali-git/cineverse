import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
  },
});

export const getPopularMovies = async () => {
  const res = await api.get('/movie/popular?language=en-US&page=1');
  return res.data.results;
};
