import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);

  const checkUserExists = async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) return false;
  
  try {
    const res = await fetch(`http://localhost:5000/api/auth/user/${userId}`);
    if (!res.ok) {
      setUser(null);
      localStorage.clear();
      window.location.href = '/login';
      return false;
    }
    return true;
  } catch (err) {
    setUser(null);
    localStorage.clear();
    window.location.href = '/login';
    return false;
  }
};

const login = async (emailOrUsername, password) => {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/login', { 
      email: emailOrUsername,
      password 
    });
    setUser(res.data.user);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userId', res.data.user._id);
    localStorage.setItem('username', res.data.user.fullName);
    localStorage.setItem('userEmail', res.data.user.email);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};
  const signup = async (fullName, email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user._id);
      localStorage.setItem('username', data.user.fullName);
      localStorage.setItem('userEmail', data.user.email);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, checkUserExists }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);