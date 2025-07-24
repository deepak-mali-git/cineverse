import React, { createContext, useContext, useState } from 'react';

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [heroMode, setHeroMode] = useState('info');
    const [initialLoad, setInitialLoad] = useState(true);

  return (
    <MovieContext.Provider value={{ heroMovie, setHeroMovie, heroMode, setHeroMode, initialLoad, setInitialLoad }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);