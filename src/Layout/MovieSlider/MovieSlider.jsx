import React, { useRef } from 'react';
import './MovieSlider.css';
import { FaImage, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieSlider = ({ title, movies, onInfoClick, onPlayClick }) => {
  const sliderRef = useRef(null);
  const navigate = useNavigate(); 

  const scroll = (scrollOffset) => {
    if (sliderRef.current) {
      sliderRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className="movie-slider container">
      <h2 className="title">{title}</h2>
      <div className="slider-wrapper">
        <button className="slide-button prev" onClick={() => scroll(-1300)}>
          &lt;
        </button>
        <div className="movie-slider-row" ref={sliderRef}>
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
              />

              <div className="hover-card">
                <div className="hover-top">
                  <div className="play-review">
                                      <button className="play-btn"
                    onClick={() => onPlayClick && onPlayClick(movie)}
                  >▶ Play</button>
                  <button
                  className="review-btn play-btn"
                  onClick={() => navigate(`/movie/${movie.id}/review`)}
                >
                Review
                </button>
                  </div>
                  <div className="hover-icons">
                    <button className="icon-btn icon-circle">+</button>
                    <button className="icon-btn icon-circle"
                      onClick={() => onInfoClick && onInfoClick(movie)}
                    ><FaImage/></button>
                    <button
                      className="icon-btn icon-circle"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                      title="View Details" >
                      i
                    </button>
                  </div>
                </div>
                <div className="hover-info">
                  <p className="meta">
                    ⭐ {movie.vote_average} &nbsp;|&nbsp;{' '}
                    {movie.original_language?.toUpperCase()} &nbsp;|&nbsp;{' '}
                    {movie.release_date?.split('-')[0]}
                  </p>
                  <p className="desc">
                    {movie.overview?.split(' ').slice(0, 25).join(' ')}...
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="slide-button next" onClick={() => scroll(1300)}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default MovieSlider;