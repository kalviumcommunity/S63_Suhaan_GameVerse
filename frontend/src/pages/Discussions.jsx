import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronUp, FaChevronDown, FaComment, FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const popularTags = [
  { label: 'RPG', icon: '🎮' },
  { label: 'FPS', icon: '🔫' },
  { label: 'Strategy', icon: '♟️' },
  { label: 'Action', icon: '⚡' },
  { label: 'Adventure', icon: '🗺️' },
  { label: 'Discussion', icon: '💬' },
  { label: 'Guide', icon: '📖' },
  { label: 'Tips', icon: '💡' },
  { label: 'Updates', icon: '🆕' },
  { label: 'DLC', icon: '🧩' },
  { label: 'Cyberpunk 2077', icon: '🤖' },
  { label: "Baldur's Gate 3", icon: '🧙‍♂️' },
  { label: 'Starfield', icon: '🚀' },
  { label: '2023', icon: '📅' }
];

const Discussion = () => {
  const [discussions, setDiscussions] = useState([]);
  const [search, setSearch] = useState('');
  const [newThread, setNewThread] = useState({ title: '', content: '', tags: '' });
  const [showNewThread, setShowNewThread] = useState(false);
  const [postError, setPostError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/discussions');
      setDiscussions(res.data);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    }
    setLoading(false);
  };

  const handlePost = async () => {
    setPostError('');
    if (!newThread.title.trim() || !newThread.content.trim()) {
      setPostError('Title and content are required.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/discussions',
        {
          title: newThread.title,
          content: newThread.content,
          tags: newThread.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewThread({ title: '', content: '', tags: '' });
      setShowNewThread(false);
      setPostError('');
      fetchDiscussions();
    } catch (err) {
      setPostError('Failed to post discussion. Please try again.');
      console.error('Error posting discussion:', err);
    }
  };

  // Upvote/Downvote (mocked, optimistic UI)
  const handleVote = async (id, type) => {
    try {
      const endpoint = type === 'up' ? 'upvote' : 'downvote';
      await axios.post(`http://localhost:5000/api/discussions/${id}/${endpoint}`);
      await fetchDiscussions();
      if (selectedDiscussion && selectedDiscussion.id === id) {
        const updated = discussions.find(d => d.id === id);
        setSelectedDiscussion(updated);
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  // Tag filter
  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.content.toLowerCase().includes(search.toLowerCase()) ||
      (d.tags && d.tags.join(',').toLowerCase().includes(search.toLowerCase()));
    const matchesTag = activeTag ? (d.tags && d.tags.includes(activeTag)) : true;
    return matchesSearch && matchesTag;
  });

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } })
  };

  const skeletonArray = Array(4).fill(0);

  // Responsive grid columns
  const getGridCols = () => {
    if (window.innerWidth < 640) return 'grid-cols-1';
    if (window.innerWidth < 1024) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  const [gridCols, setGridCols] = useState(getGridCols());
  useEffect(() => {
    const handleResize = () => setGridCols(getGridCols());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      setCommentError('Comment cannot be empty.');
      return;
    }
    setCommentLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/discussions/${selectedDiscussion.id}/comments`, {
        username: 'Anonymous', // Replace with actual username if you have auth
        content: comment
      });
      setComment('');
      setCommentError('');
      // Refresh discussions and selectedDiscussion
      await fetchDiscussions();
      // Find the updated discussion
      const updated = discussions.find(d => d.id === selectedDiscussion.id);
      setSelectedDiscussion(updated);
    } catch (err) {
      setCommentError('Failed to post comment.');
    }
    setCommentLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181818] via-[#1a1a1a] to-[#181818] text-white flex flex-col">
      {/* Header with glassmorphism */}
      <header className="sticky top-0 z-30 bg-[#23272f] border-b border-[#2d3748] shadow-lg px-4 pt-10 pb-6 flex flex-col items-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold font-['Orbitron'] text-white mb-2 text-center drop-shadow-lg relative">
          Discussions
          <span className="block h-1 w-24 mx-auto mt-2 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full" />
        </h1>
        <p className="text-lg text-white/70 font-light mb-2 text-center flex items-center gap-2">
          <span>Join the conversation!</span> <span>💬</span>
        </p>
        <div className="w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search discussions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-[#181818] text-white border border-[#2d3748] shadow focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg mb-2"
          />
        </div>
      </header>

      {/* Tags: horizontal scroll on mobile, vertical sidebar on desktop */}
      <div className="w-full flex flex-col md:flex-row">
        <aside className="hidden md:block w-64 p-6 bg-[#23272f] border-r border-[#2d3748] min-h-screen">
          <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
          <div className="flex flex-col gap-2">
            {popularTags.map(tag => (
              <button
                key={tag.label}
                onClick={() => setActiveTag(tag.label === activeTag ? '' : tag.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow transition-all border-2 ${
                  tag.label === activeTag
                    ? 'bg-gradient-to-r from-pink-500 to-yellow-500 text-white border-pink-500 scale-105 shadow-lg'
                    : 'bg-[#181818] text-pink-400 border-[#2d3748] hover:bg-pink-500 hover:text-white'
                }`}
              >
                <span>{tag.icon}</span> {tag.label}
              </button>
            ))}
            {activeTag && (
              <button
                className="mt-4 px-4 py-2 rounded-full border-2 border-pink-500 text-pink-500 bg-transparent hover:bg-pink-500 hover:text-white font-semibold shadow"
                onClick={() => setActiveTag('')}
              >
                Clear Filter
              </button>
            )}
          </div>
        </aside>
        <div className="md:hidden w-full px-4 py-3 bg-white/10 backdrop-blur-lg border-b border-white/20 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {popularTags.map(tag => (
              <motion.button
                key={tag.label}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.08 }}
                onClick={() => setActiveTag(tag.label === activeTag ? '' : tag.label)}
                className={`px-4 py-2 rounded-full text-sm border font-semibold transition-all shadow-sm whitespace-nowrap ${
                  tag.label === activeTag
                    ? 'bg-[#b91c1c] text-white border-[#b91c1c] shadow-lg'
                    : 'bg-white/20 text-[#b91c1c] border-[#b91c1c]/30 hover:bg-[#b91c1c]/70 hover:text-white'
                }`}
              >
                {tag.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen">
          {/* Floating New Thread Button (FAB) */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNewThread(true)}
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-pink-500 to-yellow-500 text-white p-6 rounded-full shadow-xl border-4 border-white/20 animate-bounce hover:scale-110 transition group"
          >
            <FaPlus />
            <span className="absolute bottom-20 right-0 bg-[#23272f] text-white px-4 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-sm font-semibold">Start a new discussion!</span>
          </motion.button>

          {/* New Thread Modal */}
          <AnimatePresence>
            {showNewThread && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ scale: 0.8, opacity: 0, filter: 'blur(8px)' }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-10 max-w-xl"
                >
                  <h3 className="text-2xl font-bold mb-6 text-white">Start a New Discussion</h3>
                  <input
                    className="w-full p-4 bg-[#181818]/80 text-white rounded-2xl mb-4 border border-[#b91c1c]/30 text-lg"
                    type="text"
                    placeholder="Thread Title"
                    value={newThread.title}
                    onChange={e => setNewThread({ ...newThread, title: e.target.value })}
                  />
                  <input
                    className="w-full p-4 bg-[#181818]/80 text-white rounded-2xl mb-4 border border-[#b91c1c]/30 text-lg"
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newThread.tags}
                    onChange={e => setNewThread({ ...newThread, tags: e.target.value })}
                  />
                  <textarea
                    className="w-full p-4 bg-[#181818]/80 text-white rounded-2xl mb-4 border border-[#b91c1c]/30 text-lg"
                    rows="4"
                    placeholder="What's on your mind?"
                    value={newThread.content}
                    onChange={e => setNewThread({ ...newThread, content: e.target.value })}
                  />
                  {postError && (
                    <div className="text-red-400 mb-3 text-sm font-semibold">{postError}</div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-6 py-3 rounded-2xl bg-gray-700 text-gray-300 hover:bg-gray-800 text-lg"
                      onClick={() => { setShowNewThread(false); setPostError(''); }}
                    >Cancel</button>
                    <button
                      className="px-6 py-3 rounded-2xl bg-[#b91c1c] text-white hover:bg-[#ef4444] text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handlePost}
                      disabled={!newThread.title.trim() || !newThread.content.trim()}
                    >Post</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discussion Detail Modal */}
          <AnimatePresence>
            {selectedDiscussion && (
              <motion.div
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="bg-[#23272f] rounded-3xl shadow-2xl p-0 max-w-2xl w-full relative flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-10 border-b border-[#2d3748]">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={selectedDiscussion.avatar || `https://api.dicebear.com/6.x/bottts/svg?seed=${selectedDiscussion.username}`}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border-2 border-pink-500 object-cover"
                    />
                    <span className="font-semibold text-xl text-white">{selectedDiscussion.username}</span>
                    {selectedDiscussion.badge && (
                      <span className="ml-2 text-sm font-semibold text-pink-500">{selectedDiscussion.badge}</span>
                    )}
                    {selectedDiscussion.pinned && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-pink-500 text-xs text-white font-bold">Pinned</span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mb-4 text-white">{selectedDiscussion.title}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedDiscussion.tags && selectedDiscussion.tags.map(tag => {
                      const tagObj = popularTags.find(t => t.label === tag);
                      return (
                        <span
                          key={tag}
                          onClick={e => { e.stopPropagation(); setActiveTag(tag === activeTag ? '' : tag); }}
                          className={`px-4 py-2 rounded-full text-xs font-semibold border cursor-pointer transition-colors bg-white/20 text-[#b91c1c] border-[#b91c1c]/40 hover:bg-[#b91c1c]/60 hover:text-white ${tag === activeTag ? 'ring-2 ring-pink-500' : ''}`}
                        >
                          {tagObj ? tagObj.icon : '🏷️'} {tag}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-gray-200 mb-8 whitespace-pre-line text-lg">{selectedDiscussion.content}</p>
                  <div className="flex items-center gap-6">
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      className="text-gray-400 hover:text-pink-500 transition-colors text-2xl"
                      onClick={() => handleVote(selectedDiscussion._id, 'up')}
                    >
                      <FaChevronUp />
                    </motion.button>
                    <span className="font-bold text-2xl">{selectedDiscussion.upvotes || 0}</span>
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      className="text-gray-400 hover:text-yellow-500 transition-colors text-2xl"
                      onClick={() => handleVote(selectedDiscussion._id, 'down')}
                    >
                      <FaChevronDown />
                    </motion.button>
                  </div>
                </div>
                <div className="w-full bg-[#181818] p-6 overflow-y-auto max-h-[50vh] flex flex-col">
                  <h4 className="text-lg font-bold mb-2 text-white">Comments</h4>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {selectedDiscussion.comments && selectedDiscussion.comments.length > 0 ? (
                      selectedDiscussion.comments.map((c, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-[#23272f] rounded-xl p-3 text-gray-200">
                          <img src={`https://api.dicebear.com/6.x/bottts/svg?seed=${c.username}`} alt="avatar" className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover" />
                          <div>
                            <span className="font-semibold text-pink-500">{c.username}:</span> {c.content}
                            <div className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">No comments yet.</div>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full p-3 rounded-xl bg-[#23272f] text-white border border-pink-500 mb-2 pr-16"
                      rows="2"
                      placeholder="Write a comment..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      disabled={commentLoading}
                    />
                    <button
                      className="absolute right-2 bottom-2 px-4 py-2 rounded-xl bg-gradient-to-br from-pink-500 to-yellow-500 text-white font-bold shadow hover:scale-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCommentSubmit}
                      disabled={commentLoading || !comment.trim()}
                    >
                      {commentLoading ? '...' : 'Send'}
                    </button>
                  </div>
                  {commentError && <div className="text-pink-400 mb-2 text-sm font-semibold">{commentError}</div>}
                </div>
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl z-10"
                  onClick={() => setSelectedDiscussion(null)}
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Discussions List */}
          <div className="w-full max-w-7xl mx-auto py-10 px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                skeletonArray.map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#23272f] rounded-3xl shadow-lg p-8 mb-8 animate-pulse relative"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#181818] border-4 border-white shadow-lg absolute -top-8 left-1/2 -translate-x-1/2" />
                    <div className="space-y-3 mt-10">
                      <div className="h-5 bg-gray-800 rounded w-1/2" />
                      <div className="h-4 bg-gray-800 rounded w-1/3" />
                      <div className="h-4 bg-gray-800 rounded w-2/3" />
                    </div>
                  </div>
                ))
              ) : (
                <AnimatePresence>
                  {filteredDiscussions.map((d, i) => (
                    <motion.div
                      key={d.id || i}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 30 }}
                      variants={cardVariants}
                      className="bg-[#23272f] rounded-3xl shadow-lg mb-8 transition-all group cursor-pointer relative hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-pink-500"
                      whileHover={{ scale: 1.05, boxShadow: '0 8px 32px 0 #f472b6aa' }}
                      onClick={() => setSelectedDiscussion(d)}
                    >
                      <img
                        src={d.avatar || `https://api.dicebear.com/6.x/bottts/svg?seed=${d.username}`}
                        alt="avatar"
                        className="w-16 h-16 rounded-full border-4 border-white shadow-lg absolute -top-8 left-1/2 -translate-x-1/2 bg-[#181818] object-cover"
                      />
                      <div className="pt-10 pb-4 px-2 flex flex-col gap-2">
                        <div className="flex items-center gap-2 justify-center mb-2">
                          <span className="font-semibold text-base text-white">{d.username}</span>
                          {d.badge && (
                            <span className="ml-2 text-xs font-semibold text-pink-500">{d.badge}</span>
                          )}
                          {d.pinned && (
                            <span className="ml-2 px-2 py-0.5 rounded bg-pink-500 text-xs text-white font-bold">Pinned</span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-white text-center mb-1">
                          {d.title}
                          <span className="block h-1 w-12 mx-auto mt-1 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full" />
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-center mb-2">
                          {d.tags && d.tags.map(tag => {
                            const tagObj = popularTags.find(t => t.label === tag);
                            return (
                              <span
                                key={tag}
                                onClick={e => { e.stopPropagation(); setActiveTag(tag === activeTag ? '' : tag); }}
                                className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs font-bold shadow cursor-pointer ${tag === activeTag ? 'ring-2 ring-pink-500' : ''}`}
                              >
                                {tagObj ? tagObj.icon : '🏷️'} {tag}
                              </span>
                            );
                          })}
                        </div>
                        <p className="text-gray-300 mt-2 text-center line-clamp-2">{d.content}</p>
                        <span className="text-pink-400 text-sm mt-2 cursor-pointer hover:underline text-center">Read more</span>
                      </div>
                      {/* Upvote/Downvote floating */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-[#181818] rounded-2xl p-2 shadow border-2 border-pink-500">
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          className="text-gray-400 hover:text-pink-500 transition-colors text-xl"
                          onClick={e => { e.stopPropagation(); handleVote(d.id, 'up'); }}
                        >
                          <FaChevronUp />
                        </motion.button>
                        <span className="font-bold text-lg my-1 text-white">{d.upvotes || 0}</span>
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          className="text-gray-400 hover:text-yellow-500 transition-colors text-xl"
                          onClick={e => { e.stopPropagation(); handleVote(d.id, 'down'); }}
                        >
                          <FaChevronDown />
                        </motion.button>
                      </div>
                      <div className="flex items-center gap-3 mt-4 text-gray-400 text-sm justify-center">
                        <FaComment />
                        <span>{d.comments?.length || 0} Comments</span>
                        <span className="ml-auto">{new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discussion;
