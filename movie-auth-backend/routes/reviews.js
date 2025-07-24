const express = require('express');
const Review = require('../models/Review');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { movieId } = req.query;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Review POST:', req.body);
    if (!req.body.movieId) {
      console.error('Missing movieId:', req.body);
      return res.status(400).json({ error: 'movieId is required' });
    }
    const review = new Review(req.body);
    await review.save();
    res.json(review);
  } catch (err) {
    console.error('Review save error:', err);
    res.status(400).json({ error: 'Could not save review' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: 'Could not update review' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Could not delete review' });
  }
});

module.exports = router;