import React from 'react';
import Navbar from '../Layout/Navbar/Navbar';
import Footer from '../Layout/footer/Footer';
import './Movies.css'; // Make sure path is correct

const Movies = () => {
  return (
    <>
      <div className="movies-container">
        <div className="container">
            <h1>Movies Page</h1>
            <p>Welcome to the Movies page. Here you can explore all movies by genre, rating, and release date.</p>
        </div>
      </div>
    </>
  );
};

export default Movies;
