
import React, { useState, useEffect, useRef } from 'react';
import BackgroundMedia from '../Layout/BackgroundMedia';
import Controller from '../Layout/Controller/Controller.jsx';
import Hero from '../Layout/Hero/Hero.jsx';
import MovieSlider from '../Layout/MovieSlider/MovieSlider.jsx';
import useFetchMovies from '../hooks/useFetchMovies';
import '../Layout/BackgroundMedia.css';
import AnimatedPage from './AnimatedPage.jsx';
import { motion } from 'framer-motion';
import { div } from 'framer-motion/client';
import { useMovie } from '../Layout/MovieContext.jsx'; 

const Home = () => {

    const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 30,
    filter: 'blur(8px)',
    rotate: -1,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    rotate: 0,
  },
  out: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    filter: 'blur(8px)',
    rotate: 1,
  },
};

const pageTransition = {
  type: 'spring',
  stiffness: 80,
  damping: 15,
};



  // const [heroMovie, setHeroMovie] = useState(null);
  // const [heroMode, setHeroMode] = useState('info');

  const { heroMovie, setHeroMovie, heroMode, setHeroMode,initialLoad, setInitialLoad } = useMovie();

  // const [initialLoad, setInitialLoad] = useState(true);
  const [index, setIndex] = useState(0);

  const hasAutoSwitched = useRef(false);


  const { movies: trending } = useFetchMovies('trending/movie/day?region=IN', 1);
  const { movies: nowPlaying } = useFetchMovies('movie/now_playing?region=IN', 1);
  const { movies: upcoming } = useFetchMovies('movie/upcoming?region=IN', 1);
  const { movies: popular } = useFetchMovies('movie/popular?region=IN', 1);
  const { movies: topRated } = useFetchMovies('movie/top_rated?region=IN', 1);
  const { movies: action } = useFetchMovies('discover/movie?with_genres=28&sort_by=release_date.desc&region=IN', 1);
  const { movies: comedy } = useFetchMovies('discover/movie?with_genres=35&sort_by=release_date.desc&region=IN', 1);
  const { movies: horror } = useFetchMovies('discover/movie?with_genres=27&sort_by=release_date.desc&region=IN', 1);
  const { movies: romance } = useFetchMovies('discover/movie?with_genres=10749&sort_by=release_date.desc&region=IN', 1);



    // Randomly select hero movie
  useEffect(() => {
    if (!heroMovie && trending?.length > 0) {
      const randomIndex = Math.floor(Math.random() * trending.length);
      setHeroMovie(trending[randomIndex]);
      setHeroMode('info');
      setInitialLoad(true);
      hasAutoSwitched.current = false; // Reset auto switch flag
    }
  }, [trending, heroMovie, setHeroMovie, setHeroMode]);

  // Auto switch to trailer once on first load
  useEffect(() => {
    if (initialLoad && heroMovie && heroMode === 'info' && !hasAutoSwitched.current) {
      const timer = setTimeout(() => {
        setHeroMode('play');
        setInitialLoad(false);
        hasAutoSwitched.current = true; // Set flag to prevent future auto switches
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [heroMovie, heroMode, initialLoad, setHeroMode]);




  // Hero controls
  const handlePrev = () => {
    if (!trending?.length) return;
    const newIndex = (index - 1 + trending.length) % trending.length;
    setIndex(newIndex);
    setHeroMovie(trending[newIndex]);
    setHeroMode('play');
  };

  const handleNext = () => {
    if (!trending?.length) return;
    const newIndex = (index + 1) % trending.length;
    setIndex(newIndex);
    setHeroMovie(trending[newIndex]);
    setHeroMode('info');
  };

  const handleHeroPlayClick = (movie) => {
    setHeroMovie(movie);
    setHeroMode('play');
  };

  const handleInfoClick = (movie) => {
    setHeroMovie(movie);
    setHeroMode('info');
    setInitialLoad(false);
  };

  const handlePlayClick = (movie) => {
    setHeroMovie(movie);
    setHeroMode('play');
  };

  return (

    //     <motion.div
    //   variants={pageVariants}
    //   initial="initial"
    //   animate="in"
    //   exit="out"
    //   transition={pageTransition}
    // >
    <div>
      <BackgroundMedia movie={heroMovie} mode={heroMode} />
      <Controller onPrev={handlePrev} onNext={handleNext} />
      <Hero
        index={index}
        mode={heroMode}
        movie={heroMovie}
        onPlayClick={handleHeroPlayClick}
      />

      <MovieSlider title="Trending Now" movies={trending} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Top Rated" movies={topRated} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Now Playing" movies={nowPlaying} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Upcoming Releases" movies={upcoming} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Popular Picks" movies={popular} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Action Zone" movies={action} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Laugh Out Loud" movies={comedy} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Horror Night" movies={horror} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
      <MovieSlider title="Romantic Vibes" movies={romance} onInfoClick={handleInfoClick} onPlayClick={handlePlayClick} />
    </div>
    // {/* </motion.div> */}
    // <AnimatedPage>
             
    // </AnimatedPage>
  );
};

export default Home;
