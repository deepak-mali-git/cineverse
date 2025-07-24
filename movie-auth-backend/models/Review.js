const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  movieTitle: { type: String, required: true },
  moviePoster: String,
  movieOverview: String,
  userId: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: false },
  rating: { type: Number, min: 1, max: 10, required: false },
  createdAt: { type: Date, default: Date.now }
});

ReviewSchema.pre('validate', function(next) {
  if (!this.content && !this.rating) {
    const error = new Error('Either content or rating must be provided');
    error.name = 'ValidationError';
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);