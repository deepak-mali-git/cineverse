


import React, { useEffect, useState } from 'react';
import './BackgroundMedia.css';

const getConnectionSpeed = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection || !connection.downlink) return 'unknown';

  const speed = connection.downlink; // Mbps
  if (speed > 5) return 'fast';
  if (speed > 1.5) return 'medium';
  return 'slow';
};

const BackgroundMedia = ({ movie, mode }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [speed, setSpeed] = useState('unknown');

  useEffect(() => {
    setSpeed(getConnectionSpeed());
  }, []);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie || mode !== 'play') {
        setTrailerKey(null);
        return;
      }
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_BEARER}`,
            },
          }
        );
        const videoData = await res.json();
        // console.log("video data:", videoData);
        const trailer = videoData.results.find(
          (v) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        setTrailerKey(trailer?.key || null);
      } catch (err) {
        setTrailerKey(null);
      }
    };

    fetchTrailer();
  }, [movie, mode]);

  if (!movie) return <div>Loading...</div>;

  const backdropPath = movie.backdrop_path;
  const qualityParam =
    speed === 'fast'
      ? 'hd1080'
      : speed === 'medium'
      ? 'hd720'
      : speed === 'slow'
      ? 'small'
      : '';

  return (
    <div className="background-media">
      {mode === 'play' && trailerKey ? (
        <div className="iframe-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&vq=${qualityParam}`}
            title="Movie Trailer"
            frameBorder="0"
            allow="autoplay"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <img
          src={`https://image.tmdb.org/t/p/original${backdropPath}`}
          alt={movie.title}
          className="background-image"
        />
      )}
    </div>
  );
};

export default BackgroundMedia;




























