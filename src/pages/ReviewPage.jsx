import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetailsPage.css';

const TMDB_BEARER = import.meta.env.VITE_TMDB_BEARER;
const API_URL = 'http://localhost:5000/api/reviews';

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Add state for user data instead of reading localStorage on every render
  const [userAuth, setUserAuth] = useState({
    isLoggedIn: false,
    userId: null,
    username: null,
    userEmail: null
  });

  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showReviewBox, setShowReviewBox] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [myReview, setMyReview] = useState('');
  const [myRating, setMyRating] = useState('');
  const [editing, setEditing] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // New state for expanded users
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  // Check authentication once on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem('user');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const userEmail = localStorage.getItem('userEmail');

        if (user && userId && username) {
          setUserAuth({
            isLoggedIn: true,
            userId,
            username,
            userEmail
          });
        } else {
          setUserAuth({
            isLoggedIn: false,
            userId: null,
            username: null,
            userEmail: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setUserAuth({
          isLoggedIn: false,
          userId: null,
          username: null,
          userEmail: null
        });
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'userId' || e.key === 'username') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const myReviews = reviews.filter(r => r.userId === userAuth.userId);
  const otherReviews = reviews.filter(r => r.userId !== userAuth.userId);

  // Group reviews by author
  const groupedReviews = otherReviews.reduce((acc, review) => {
    const author = review.author;
    if (!acc[author]) {
      acc[author] = [];
    }
    acc[author].push(review);
    return acc;
  }, {});

  const fetchMovieAndReviews = async () => {
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

      // Fetch credits
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

      // Fetch reviews from your database
      const reviewsRes = await fetch(`${API_URL}?movieId=${id}`);
      const reviewsData = await reviewsRes.json();

      // Fetch reviews from TMDB
      const tmdbReviewsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_BEARER}`,
            accept: 'application/json',
          },
        }
      );
      const tmdbReviewsData = await tmdbReviewsRes.json();

      // Format TMDB reviews to match your database structure
      const tmdbReviews = tmdbReviewsData.results?.map(review => ({
        _id: `tmdb_${review.id}`,
        movieId: id,
        userId: `tmdb_${review.author_details?.username || review.author}`,
        author: review.author,
        content: review.content,
        createdAt: review.created_at,
        source: 'TMDB',
        rating: review.author_details?.rating || null
      })) || [];

      // Combine database reviews and TMDB reviews
      const allReviews = [...(reviewsData || []), ...tmdbReviews];

      setMovie(data);
      setCredits(creditsData);
      setReviews(allReviews);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMovie(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovieAndReviews();
  }, [id]);

  const handleReviewAction = (action, review = null) => {
    if (!userAuth.isLoggedIn) {
      navigate('/login');
      return;
    }
    setReviewAction(action);
    setShowReviewBox(true);
    setEditingReview(review);
    if (action === 'edit' && review) {
      setMyReview(review.content || '');
      setMyRating(review.rating || '');
      setEditing(true);
    } else if (action === 'add') {
      setMyReview('');
      setMyRating('');
      setEditing(false);
      setEditingReview(null);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!myReview.trim() && !myRating) {
      alert('Please provide either a review text or rating!');
      return;
    }

    const reviewData = {
      movieId: movie.id?.toString(),
      movieTitle: movie.title,
      moviePoster: movie.poster_path,
      movieOverview: movie.overview,
      userId: userAuth.userId,
      author: userAuth.username,
      content: myReview.trim() || null,
      rating: myRating ? parseFloat(myRating) : null,
      createdAt: new Date().toISOString(),
    };

    try {
      let response;
      if (reviewAction === 'add') {
        response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        });
        await response.json();
      } else if (reviewAction === 'edit' && editingReview) {
        response = await fetch(`${API_URL}/${editingReview._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        });
        await response.json();
      }
      setMyReview('');
      setMyRating('');
      setEditing(false);
      setShowReviewBox(false);
      setReviewAction(null);
      setEditingReview(null);
      await fetchMovieAndReviews();
    } catch (err) {
      alert('Error saving review!');
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/${editingReview._id}`, {
        method: 'DELETE',
      });
      setShowReviewBox(false);
      setReviewAction(null);
      setEditingReview(null);
      await fetchMovieAndReviews();
    } catch (err) {
      alert('Error deleting review!');
    }
  };

  const toggleUserReviews = (author) => {
    setExpandedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(author)) {
        newSet.delete(author);
      } else {
        newSet.add(author);
      }
      return newSet;
    });
  };

  const renderReview = (review) => (
    <div key={review._id} style={{ 
      marginBottom: 16, 
      background: review.source === 'TMDB' ? '#1a2332' : '#1a1d35', 
      padding: 16, 
      borderRadius: 8,
      border: review.source === 'TMDB' ? '1px solid #3182ce' : '1px solid #2d3748'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <strong style={{ color: '#eebbc3' }}>{review.author}</strong>
          {review.source === 'TMDB' ? (
            <span style={{ 
              fontSize: '0.75rem', 
              background: '#3182ce', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: 12,
              fontWeight: 'bold'
            }}>
              TMDB
            </span>
          ) : (
            <span style={{ 
              fontSize: '0.75rem', 
              background: '#10b981', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: 12,
              fontWeight: 'bold'
            }}>
              CV
            </span>
          )}
          {review.rating && (
            <span style={{
              fontSize: '0.8rem',
              background: '#f59e0b',
              color: 'white',
              padding: '2px 6px',
              borderRadius: 4,
              fontWeight: 'bold'
            }}>
              ⭐ {review.rating}/10
            </span>
          )}
        </div>
        <small style={{ color: '#a0aec0' }}>
          {new Date(review.createdAt).toLocaleDateString()}
        </small>
      </div>
      {review.content && (
        <p style={{ 
          color: '#e2e8f0', 
          lineHeight: '1.6',
          margin: 0
        }}>
          {review.content.length > 400 ? 
            `${review.content.slice(0, 400)}...` : 
            review.content
          }
        </p>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="movie-details-page">
        <div className="movie-details-card">
          <div style={{ textAlign: 'center', padding: '50px', color: '#eebbc3' }}>
            Loading movie details and reviews...
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-details-page">
        <div className="movie-details-card">
          <div style={{ textAlign: 'center', padding: '50px', color: '#eebbc3' }}>
            Movie not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-details-page">
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
                {credits?.cast?.length > 0 ? (
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
                  <div className="cast-empty">No cast info available.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trailer */}
        <div className="movie-details-trailer-section">
          <h2>Trailer</h2>
          <div className="movie-details-trailer-wrapper">
            <TrailerEmbed movieId={id} />
          </div>
        </div>

        {/* Review Section */}
        <div className="movie-details-reviews">
          <h2>Your Reviews</h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <button
              className="add-review-btn"
              onClick={() => handleReviewAction('add')}
              style={{ background: '#fff', color: '#232946' }}
            >
              Add Review
            </button>
          </div>

          {/* Your Reviews List */}
          {myReviews.length === 0 && reviews.length === 0 && (
            <div className="movie-details-review">No reviews yet. Be the first to review!</div>
          )}
          {myReviews.length === 0 && reviews.length > 0 && (
            <div className="movie-details-review">You haven't reviewed this movie yet.</div>
          )}

          {myReviews.map((r) => (
            <div key={r._id} style={{ 
              marginBottom: 8, 
              background: '#232946', 
              padding: 15, 
              borderRadius: 8,
              border: '2px solid #eebbc3'
            }}>
              <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <strong style={{ color: '#eebbc3' }}>{r.author}</strong>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    background: '#10b981', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: 12,
                    fontWeight: 'bold'
                  }}>
                    CV
                  </span>
                  {r.rating && (
                    <span style={{
                      fontSize: '0.8rem',
                      background: '#f59e0b',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontWeight: 'bold'
                    }}>
                      ⭐ {r.rating}/10
                    </span>
                  )}
                </div>
                <small style={{ color: '#a0aec0' }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </div>
              {r.content && (
                <p style={{ color: '#e2e8f0', margin: '8px 0' }}>
                  {r.content.slice(0, 200)}
                  {r.content.length > 200 ? '...' : ''}
                </p>
              )}
              <div style={{ marginTop: 10 }}>
                <button
                  className="add-review-btn"
                  style={{ marginRight: 8, fontSize: '0.9rem', padding: '6px 12px' }}
                  onClick={() => handleReviewAction('edit', r)}
                >
                  Edit
                </button>
                <button
                  className="add-review-btn"
                  style={{ 
                    background: '#ff4f4f', 
                    color: '#fff', 
                    fontSize: '0.9rem', 
                    padding: '6px 12px' 
                  }}
                  onClick={() => handleReviewAction('delete', r)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Review Editor or Deletion Confirm Box */}
          {showReviewBox && (
            <div style={{
              background: '#181c2f',
              borderRadius: 10,
              padding: 18,
              marginBottom: 18,
              animation: 'fadeIn .4s',
              border: '1px solid #3182ce'
            }}>
              {reviewAction === 'delete' ? (
                <div>
                  <p style={{ color: '#eebbc3', marginBottom: 15 }}>
                    Are you sure you want to delete your review?
                  </p>
                  <button
                    className="add-review-btn"
                    style={{ background: '#ff4f4f', color: '#fff', marginRight: 10 }}
                    onClick={handleDelete}
                  >
                    Yes, Delete
                  </button>
                  <button
                    className="add-review-btn"
                    style={{ background: '#232946', color: '#eebbc3' }}
                    onClick={() => { 
                      setShowReviewBox(false); 
                      setReviewAction(null); 
                      setEditingReview(null); 
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  {/* Rating Input */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: 6, 
                      color: '#eebbc3', 
                      fontSize: '0.9rem' 
                    }}>
                      Rating (1-10, optional):
                    </label>
                    <select
                      value={myRating}
                      onChange={e => setMyRating(e.target.value)}
                      style={{
                        width: '150px',
                        borderRadius: 8,
                        padding: 8,
                        fontSize: '1rem',
                        border: '1px solid #2d3748',
                        background: '#2d3748',
                        color: '#eebbc3'
                      }}
                    >
                      <option value="">Select Rating</option>
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Review Text Input */}
                  <textarea
                    value={myReview}
                    onChange={e => setMyReview(e.target.value)}
                    placeholder="Write your review here... (optional)"
                    rows={4}
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      padding: 12,
                      fontSize: '1rem',
                      marginBottom: 12,
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      border: '1px solid #2d3748'
                    }}
                  />
                  
                  <div>
                    <button type="submit" className="add-review-btn">
                      {reviewAction === 'edit' ? 'Update Review' : 'Add Review'}
                    </button>
                    <button
                      type="button"
                      className="add-review-btn"
                      style={{
                        marginLeft: 10,
                        background: '#232946',
                        color: '#eebbc3',
                        border: '1px solid #eebbc3'
                      }}
                      onClick={() => {
                        setShowReviewBox(false);
                        setReviewAction(null);
                        setMyReview('');
                        setMyRating('');
                        setEditingReview(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* All Other Reviews Section */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ color: '#eebbc3', marginBottom: 20 }}>
              All Reviews ({otherReviews.length})
            </h2>
            {otherReviews.length === 0 ? (
              <div className="movie-details-review">No other reviews yet.</div>
            ) : (
              Object.entries(groupedReviews).map(([author, userReviews]) => {
                const isExpanded = expandedUsers.has(author);
                const hasMultipleReviews = userReviews.length > 1;
                const reviewsToShow = isExpanded ? userReviews : [userReviews[0]];
                
                return (
                  <div key={author} style={{ marginBottom: 24 }}>
                    {reviewsToShow.map(review => renderReview(review))}
                    
                    {hasMultipleReviews && (
                      <button
                        onClick={() => toggleUserReviews(author)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#3182ce',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          textDecoration: 'underline',
                          padding: '5px 0',
                          marginTop: -8,
                          marginBottom: 8
                        }}
                      >
                        {isExpanded 
                          ? `Show less from ${author}` 
                          : `See more from ${author} (${userReviews.length - 1} more review${userReviews.length > 2 ? 's' : ''})`
                        }
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TrailerEmbed = ({ movieId }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        setLoading(true);
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
      } catch (error) {
        console.error('Error fetching trailer:', error);
        setTrailerKey(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (movieId) {
      fetchTrailer();
    }
  }, [movieId]);

  if (loading) {
    return <div style={{ color: '#eebbc3', textAlign: 'center', padding: '20px' }}>Loading trailer...</div>;
  }

  if (!trailerKey) {
    return <div style={{ color: '#eebbc3', textAlign: 'center', padding: '20px' }}>No trailer available.</div>;
  }

  return (
    <iframe
      src={`https://www.youtube.com/embed/${trailerKey}`}
      title="Movie Trailer"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      style={{
        width: '100%',
        height: '400px',
        borderRadius: '8px'
      }}
    />
  );
};

export default ReviewPage;