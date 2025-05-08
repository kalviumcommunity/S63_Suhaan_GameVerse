const express = require('express');
const router = express.Router();

// Example in-memory storage (replace with DB logic)
let discussions = [
  {
    id: 1,
    title: 'Best RPGs of 2023',
    content: 'What are your favorite RPG games released this year?',
    tags: ['RPG', '2023', 'Discussion'],
    createdAt: new Date('2023-11-01T10:00:00Z'),
    upvotes: 5,
    comments: [
      { username: 'RPGMaster', content: 'Baldur\'s Gate 3 is amazing!', createdAt: new Date('2023-11-01T11:00:00Z') },
      { username: 'QuestLover', content: 'I loved Starfield too!', createdAt: new Date('2023-11-01T12:00:00Z') }
    ],
    username: 'GameFanatic',
  },
  {
    id: 2,
    title: 'Tips for Cyberpunk 2077',
    content: 'Share your best tips and tricks for Cyberpunk 2077!',
    tags: ['Cyberpunk 2077', 'Tips', 'Guide'],
    createdAt: new Date('2023-11-02T12:30:00Z'),
    upvotes: 8,
    comments: [
      { username: 'HackerDude', content: 'Always upgrade your cyberware!', createdAt: new Date('2023-11-02T13:00:00Z') }
    ],
    username: 'VRunner',
  },
  {
    id: 3,
    title: 'Starfield: First Impressions',
    content: 'What do you think about Starfield so far?',
    tags: ['Starfield', '2023', 'Discussion'],
    createdAt: new Date('2023-11-03T15:45:00Z'),
    upvotes: 3,
    comments: [],
    username: 'SpaceExplorer',
  },
  {
    id: 4,
    title: 'Best FPS Games',
    content: 'Let\'s talk about the best FPS games of all time!',
    tags: ['FPS', 'Discussion'],
    createdAt: new Date('2023-11-04T09:20:00Z'),
    upvotes: 10,
    comments: [],
    username: 'ShooterPro',
  },
  {
    id: 5,
    title: 'Strategy Game Recommendations',
    content: 'Looking for some good strategy games to play. Any suggestions?',
    tags: ['Strategy', 'Guide'],
    createdAt: new Date('2023-11-05T14:10:00Z'),
    upvotes: 6,
    comments: [],
    username: 'Strategist',
  }
];

// GET /api/discussions
router.get('/', (req, res) => {
  res.json(discussions);
});

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
    comments: [],
    username: 'Anonymous', // Replace with real user if you have auth
  };
  discussions.push(newDiscussion);
  res.status(201).json(newDiscussion);
});

// POST /api/discussions/:id/comments
router.post('/:id/comments', (req, res) => {
  const discussion = discussions.find(d => d.id === parseInt(req.params.id));
  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found.' });
  }
  const { username = 'Anonymous', content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Comment content is required.' });
  }
  const comment = {
    username,
    content,
    createdAt: new Date(),
  };
  discussion.comments.push(comment);
  res.status(201).json(comment);
});

// POST /api/discussions/:id/upvote
router.post('/:id/upvote', (req, res) => {
  const discussion = discussions.find(d => d.id === parseInt(req.params.id));
  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found.' });
  }
  discussion.upvotes = (discussion.upvotes || 0) + 1;
  res.json({ upvotes: discussion.upvotes });
});

// POST /api/discussions/:id/downvote
router.post('/:id/downvote', (req, res) => {
  const discussion = discussions.find(d => d.id === parseInt(req.params.id));
  if (!discussion) {
    return res.status(404).json({ error: 'Discussion not found.' });
  }
  discussion.upvotes = (discussion.upvotes || 0) - 1;
  res.json({ upvotes: discussion.upvotes });
});

module.exports = router;
