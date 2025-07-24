import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'; 
import './LoginSignup.css';

const LoginSignup = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  // Real-time password validation
  const getPasswordValidation = (password) => {
    return {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  };

  const passwordChecks = getPasswordValidation(password);
  const allPasswordValid = Object.values(passwordChecks).every(check => check);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const formPassword = formData.get('password');
    const fullName = formData.get('fullname') || '';

    // Frontend password validation for signup
    if (isSignup && !allPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    try {
      let response;
      if (isSignup) {
        response = await signup(fullName, email, formPassword);
      } else {
        response = await login(email, formPassword);
      }

      // Only save and redirect if response is successful
      if (response && response.user) {
        localStorage.setItem('userId', response.user._id);
        localStorage.setItem('username', response.user.fullName);
        localStorage.setItem('userEmail', response.user.email);
        localStorage.setItem('user', 'true');
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              className="auth-input"
              required
            />
          )}
          
          <input
            type="text"
            name="email"
            placeholder="Username or Email"
            className="auth-input"
            required
          />
          
          <div className="password-container">
            <input
              type="password"
              name="password"
              placeholder={isSignup ? "Password (min 6 chars, 1 uppercase, 1 number, 1 special)" : "Password"}
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => isSignup && setShowPasswordValidation(true)}
              onBlur={() => setShowPasswordValidation(false)}
              required
            />
            
            {/* Password Validation Popup */}
            {isSignup && showPasswordValidation && (
              <div className="password-validation">
                <div className={`validation-item ${passwordChecks.length ? 'valid' : 'invalid'}`}>
                  <span className="validation-icon">{passwordChecks.length ? '✓' : '✗'}</span>
                  <span>At least 6 characters</span>
                </div>
                <div className={`validation-item ${passwordChecks.uppercase ? 'valid' : 'invalid'}`}>
                  <span className="validation-icon">{passwordChecks.uppercase ? '✓' : '✗'}</span>
                  <span>One uppercase letter</span>
                </div>
                <div className={`validation-item ${passwordChecks.number ? 'valid' : 'invalid'}`}>
                  <span className="validation-icon">{passwordChecks.number ? '✓' : '✗'}</span>
                  <span>One number</span>
                </div>
                <div className={`validation-item ${passwordChecks.special ? 'valid' : 'invalid'}`}>
                  <span className="validation-icon">{passwordChecks.special ? '✓' : '✗'}</span>
                  <span>One special character</span>
                </div>
              </div>
            )}
          </div>
          
          <button className="auth-btn" type="submit">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        
        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{' '}
          <span className="toggle-link" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;