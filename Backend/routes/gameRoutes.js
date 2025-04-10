const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new game
router.post('/', async (req, res) => {
    const { title, genre, platform, releaseDate, description, coverImage } = req.body;

    const game = new Game({ title, genre, platform, releaseDate, description, coverImage });

    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
