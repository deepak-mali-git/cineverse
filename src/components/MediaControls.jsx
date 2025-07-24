import React from 'react';
import '../styles/HeroSection.css';

const MediaControls = ({ onPrev, onNext, setShowTrailer }) => {

  

  return (
    <>
      <button
        className="nav-button left"
        onClick={() => {
          setShowTrailer(true);
          onPrev();
        }}
      >
        &lt;
      </button>
      <button
        className="nav-button right"
        onClick={() => {
          setShowTrailer(false);
          onNext();
        }}
      >
        &gt;
      </button>
    </>
  );
};

export default MediaControls;
