const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: String,
    platform: String,
    releaseDate: Date,
    description: String,
    coverImage: String
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);
