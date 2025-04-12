const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET all games
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().sort({ createdAt: -1 }); // Sort by newest first
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
// PUT - Update a game by ID
router.put('/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


module.exports = router;