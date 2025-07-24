import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaSignOutAlt, FaFilm, FaHeart, FaStar, FaUserCircle } from 'react-icons/fa';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Redirect to login after 1.5 seconds if no user
  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 1300);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <FaUserCircle size={80} className="profile-avatar" />
          <h2>Please log in to view your profile.</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.profilePicUrl || 'https://i.pravatar.cc/150'}
            alt="Profile"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>{user.fullName}</h2>
            <p className="profile-email">{user.email}</p>
            <button className="profile-edit-btn" title="Edit Profile (coming soon)">
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-action-btn" title="Logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <div className="profile-stats">
          <div className="profile-stat">
            <FaFilm className="profile-stat-icon" />
            <div>
              <div className="profile-stat-number">0</div>
              <div className="profile-stat-label">Watched</div>
            </div>
          </div>
          <div className="profile-stat">
            <FaHeart className="profile-stat-icon" />
            <div>
              <div className="profile-stat-number">0</div>
              <div className="profile-stat-label">Favorites</div>
            </div>
          </div>
          <div className="profile-stat">
            <FaStar className="profile-stat-icon" />
            <div>
              <div className="profile-stat-number">0</div>
              <div className="profile-stat-label">Rated</div>
            </div>
          </div>
        </div>
        <div className="profile-section">
          <h3>Watchlist</h3>
          <div className="profile-watchlist-empty">
            <p>Your watchlist is empty. Start adding movies!</p>
          </div>
        </div>
        <div className="profile-section">
          <h3>Account Settings</h3>
          <ul className="profile-settings-list">
            <li>Change Password (coming soon)</li>
            <li>Notification Preferences (coming soon)</li>
            <li>Delete Account (coming soon)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;