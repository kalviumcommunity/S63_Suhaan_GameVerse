const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Game = require('../models/Game');
const User = require('../models/User');

// GET all reviews for a game
router.get('/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ game: req.params.gameId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new review for a game
router.post('/:gameId', async (req, res) => {
  const { user, rating, comment } = req.body;
  if (!user || !rating || !comment) {
    return res.status(400).json({ message: 'User, rating, and comment are required.' });
  }
  try {
    // Optionally, validate user and game existence
    const review = new Review({
      user,
      game: req.params.gameId,
      rating,
      comment,
    });
    await review.save();
    const populatedReview = await review.populate('user', 'username');
    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 