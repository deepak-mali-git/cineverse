import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import MainLayout from './Layout/MainLayout';
import Home from './pages/Home.jsx';
import Movies from './pages/Movies.jsx';
import Series from './pages/Series.jsx';
import Genres from './pages/Genres.jsx';
import LoginSignup from './pages/LoginSignup.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MovieDetailsPage from './pages/MovieDetailsPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

const App = () => {
  const location = useLocation();
  const { checkUserExists } = useAuth();

  useEffect(() => {
    
    const validateUser = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          await checkUserExists();
        } catch (error) {
          console.log('Error validating user:', error);
        }
      }
    };
    
    validateUser();
  }, [checkUserExists, location.pathname]); 

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="movies" element={<PageWrapper><Movies /></PageWrapper>} />
          <Route path="series" element={<PageWrapper><Series /></PageWrapper>} />
          <Route path="genres" element={<PageWrapper><Genres /></PageWrapper>} />
          <Route path="/login" element={<PageWrapper><LoginSignup /></PageWrapper>} />
          <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          <Route path="/movies/:id" element={<PageWrapper><MovieDetailsPage /></PageWrapper>} />
          <Route path="/movie/:id/review" element={<PageWrapper><ReviewPage /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;