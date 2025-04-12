// models/Game.js
const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: [String],
  platform: [String],
  releaseDate: Date,
  description: String,
  imageUrl: String,
  reviews: [
    {
      user: String,
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Game', gameSchema);
