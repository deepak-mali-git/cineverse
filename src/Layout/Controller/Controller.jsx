
import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import './Controller.css';

const Controller = ({ onPrev, onNext }) => (
<div className="container">
    <div className="controller">
    <button className="left-previou btn" onClick={onPrev}>
      <HiChevronLeft size={40} />
    </button>
    <button className="right-previou btn" onClick={onNext}>
      <HiChevronRight size={40} />
    </button>
  </div>
</div>
);

export default Controller;