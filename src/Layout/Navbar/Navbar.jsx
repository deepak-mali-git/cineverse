

import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaHome, FaFilm, FaUserCircle, FaBox } from 'react-icons/fa';
import { MdOutlineLiveTv } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`container navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-left">
        <div className="logo glow-text">CineVerse</div>
        <ul className="nav-links">
          <li>
            <Link to="/">
              <FaHome /> Home
            </Link>
          </li>
          <li>
            <Link to="/movies">
              <FaFilm /> Movies
            </Link>
          </li>
          <li>
            <Link to="/series">
              <MdOutlineLiveTv /> Series
            </Link>
          </li>
          <li>
            <Link to="/genres">
              <FaBox /> Genres
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <input type="text" placeholder="Search..." className="search-input" />
{user ? (
  <div className="navbar-user">
    <img
      src={user?.profilePicUrl || 'https://i.pravatar.cc/40'}
      alt="Profile"
      className="profile-pic"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate('/profile')}
    />
  </div>
) : (
  <Link to="/login" className="profile-link">
    <FaUserCircle className="profile-icon" />
  </Link>
)}
      </div>
    </nav>
  );
};

export default Navbar;