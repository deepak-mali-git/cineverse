
import { useEffect, useState } from 'react';

const BASE_URL = 'https://api.themoviedb.org/3';

const useFetchMovies = (endpoint, page = 1) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const BEARER = import.meta.env.VITE_TMDB_BEARER;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = `${BASE_URL}/${endpoint.includes('?') ? `${endpoint}&` : `${endpoint}?`}page=${page}`;

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${BEARER}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();

        const filteredMovies = (data.results || []).filter(movie =>
          movie.poster_path || movie.video 
        );

        setMovies(filteredMovies);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, page]);

  return { movies, loading };
};

export default useFetchMovies;
