const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const validatePassword = (password) => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
};

router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ 
      fullName: { $regex: new RegExp(`^${fullName}$`, 'i') } 
    });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already in use' });

    const passwordError = validatePassword(password);
    if (passwordError) return res.status(400).json({ message: passwordError });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      profilePicUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
    });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicUrl: user.profilePicUrl
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const isEmail = email.includes('@');
    const user = await User.findOne(
      isEmail 
        ? { email: email } 
        : { fullName: { $regex: new RegExp(`^${email}$`, 'i') } }
    );
    
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePicUrl: user.profilePicUrl
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ exists: true, user: { _id: user._id, fullName: user.fullName, email: user.email } });
  } catch (err) {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;