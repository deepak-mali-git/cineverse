import { useEffect, useState } from 'react';
import { getPopularMovies } from '../services/movieService';

const useHeroMedia = () => {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getPopularMovies();
      setMovies(data);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movies.length || !showTrailer) {
        setTrailerKey(null);
        return;
      }

      const movie = movies[index];

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
          },
        }
      );

      const data = await res.json();
      const trailer = data.results.find(
        (v) => v.type === 'Trailer' && v.site === 'YouTube'
      );

      setTrailerKey(trailer?.key || null);
    };

    fetchTrailer();
  }, [movies, index, showTrailer]);

  const currentMovie = movies[index];
  const posterUrl = currentMovie
    ? `https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`
    : '';

  return {
    trailerKey,
    posterUrl,
    showTrailer,
    setShowTrailer,
    goPrev: () => setIndex((prev) => (prev - 1 + movies.length) % movies.length),
    goNext: () => setIndex((prev) => (prev + 1) % movies.length),
    loading: !movies.length,
  };
};

export default useHeroMedia;
