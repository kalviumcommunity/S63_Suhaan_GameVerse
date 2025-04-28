const express = require('express');
const router = express.Router();

// Example in-memory storage (replace with DB logic)
let discussions = [];

// POST /api/discussions
router.post('/', (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }
  const newDiscussion = {
    id: discussions.length + 1,
    title,
    content,
    tags,
    createdAt: new Date(),
    upvotes: 0,
    commentsCount: 0,
    username: 'Anonymous', // Replace with real user if you have auth
  };
  discussions.push(newDiscussion);
  res.status(201).json(newDiscussion);
});

module.exports = router;
