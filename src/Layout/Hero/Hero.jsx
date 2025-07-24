import React, { useEffect, useState } from 'react';
import './Hero.css';
import { FaStar } from 'react-icons/fa';

const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const Hero = ({ movie, mode, onPlayClick }) => {
  const [studio, setStudio] = useState('Studio Info Unavailable');

  useEffect(() => {
    if (!movie) return;
    
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.production_companies && data.production_companies.length > 0) {
          setStudio(data.production_companies[0].name);
        } else {
          setStudio('Studio Info Unavailable');
        }
      })
      .catch(() => setStudio('Studio Info Unavailable'));
  }, [movie]);

  if (!movie) return null;

  
  const genreNames = movie.genre_ids
    ? movie.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean).join(', ')
    : 'Genre';

  return (
    <div className="container">
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-description">{movie.overview}</p>
        <div className="hero-info">
          <span className="studio">{studio}</span>
          <span className="genre">{genreNames}</span>
          <span className="year">{movie.release_date?.split('-')[0]}</span>
          <span className="rating-label">TMDB</span>
          <span className="rating"><FaStar className="star" /> {movie.vote_average}</span>
        </div>
        <button className="play-btn" onClick={() => onPlayClick && onPlayClick(movie)}>
          ▶ Play
        </button>
      </div>
    </div>
  );
};

export default Hero;