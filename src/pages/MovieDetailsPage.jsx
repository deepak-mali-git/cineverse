import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetailsPage.css';

const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;
const MONGO_API_URL = 'http://localhost:5000/api/reviews';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const [mongoReviews, setMongoReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      try {
        // Fetch movie details
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_BEARER}`,
              accept: 'application/json',
            },
          }
        );
        const data = await res.json();

        // Fetch credits (cast)
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_BEARER}`,
              accept: 'application/json',
            },
          }
        );
        const creditsData = await creditsRes.json();

        // Fetch TMDB reviews
        const tmdbReviewsRes = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_BEARER}`,
              accept: 'application/json',
            },
          }
        );
        const tmdbReviewsData = await tmdbReviewsRes.json();

        // Fetch MongoDB reviews
        const mongoReviewsRes = await fetch(`${MONGO_API_URL}?movieId=${id}`);
        const mongoReviewsData = await mongoReviewsRes.json();

        setMovie(data);
        setCredits(creditsData);
        setTmdbReviews(tmdbReviewsData.results || []);
        setMongoReviews(mongoReviewsData || []);
      } catch (err) {
        setMovie(null);
      }
      setLoading(false);
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div className="movie-details-page"><div className="movie-details-card">Loading...</div></div>;
  }

  if (!movie) {
    return <div className="movie-details-page"><div className="movie-details-card">Movie not found.</div></div>;
  }

  return (
    <div className="movie-details-page container">
      <div className="movie-details-card">
        <div className="movie-details-main">
          <img
            className="movie-details-poster"
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
            alt={movie.title}
          />
          <div className="movie-details-info">
            <h1 className="movie-details-title">{movie.title}</h1>
            <div className="movie-details-meta">
              <span className="movie-details-rating">⭐ {movie.vote_average}</span>
              <span className="movie-details-type">{movie.media_type || 'Movie'}</span>
              <span className="movie-details-date">{movie.release_date}</span>
            </div>
            <div className="movie-details-genres">
              {movie.genres && movie.genres.map((g) => (
                <span key={g.id} className="movie-details-genre">{g.name}</span>
              ))}
            </div>
            <p className="movie-details-overview">{movie.overview}</p>
            <div className="movie-details-cast">
              <strong>Cast:</strong>
              <div className="cast-list">
                {credits && credits.cast && credits.cast.length > 0 ? (
                  credits.cast.slice(0, 10).map((actor) => (
                    <div className="cast-card" key={actor.cast_id || actor.id}>
                      <img
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                            : "https://via.placeholder.com/80x120?text=No+Image"
                        }
                        alt={actor.name}
                        className="cast-img"
                      />
                      <div className="cast-name">{actor.name}</div>
                      <div className="cast-character">{actor.character}</div>
                    </div>
                  ))
                ) : (
                  <div className="cast-empty">No cast info.</div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="movie-details-trailer-section">
          <h2>Trailer</h2>
          <div className="movie-details-trailer-wrapper">
            <TrailerEmbed movieId={id} />
          </div>
        </div>
        <div className="movie-details-reviews">
          <h2>Reviews</h2>
          {/* TMDB Reviews */}
          {tmdbReviews.length === 0 && mongoReviews.length === 0 && (
            <div className="movie-details-review">No reviews yet.</div>
          )}
          {tmdbReviews.length > 0 && (
            <div>
              <h3>TMDB Reviews</h3>
              {tmdbReviews.map((r) => (
                <div key={r.id} className="movie-details-review">
                  <strong>{r.author}:</strong> {r.content.slice(0, 200)}{r.content.length > 200 ? '...' : ''}
                </div>
              ))}
            </div>
          )}
          {/* MongoDB Reviews */}
          {mongoReviews.length > 0 && (
            <div>
              <h3>User Reviews</h3>
              {mongoReviews.map((r) => (
                <div key={r._id} className="movie-details-review">
                  <strong>{r.author}:</strong> {r.content ? r.content.slice(0, 200) : ''}
                  {r.content && r.content.length > 200 ? '...' : ''}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component to fetch and embed the trailer
const TrailerEmbed = ({ movieId }) => {
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${TMDB_BEARER}`,
              accept: 'application/json',
            },
          }
        );
        const data = await res.json();
        const trailer = data.results?.find(
          (vid) => vid.type === 'Trailer' && vid.site === 'YouTube'
        );
        setTrailerKey(trailer ? trailer.key : null);
      } catch {
        setTrailerKey(null);
      }
    };
    fetchTrailer();
  }, [movieId]);

  if (!trailerKey) return <div>No trailer available.</div>;

  return (
    <iframe
      src={`https://www.youtube.com/embed/${trailerKey}`}
      title="Trailer"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
};

export default MovieDetailsPage;