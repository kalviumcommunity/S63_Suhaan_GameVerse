import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronUp, FaChevronDown, FaComment, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const popularTags = [
  'RPG', 'FPS', 'Strategy', 'Action', 'Adventure', 'Discussion', 'Guide',
  'Tips', 'Updates', 'DLC', 'Cyberpunk 2077', 'Baldur\'s Gate 3', 'Starfield', '2023'
];

const Discussion = () => {
  const [discussions, setDiscussions] = useState([]);
  const [search, setSearch] = useState('');
  const [newThread, setNewThread] = useState({ title: '', content: '', tags: '' });
  const [showNewThread, setShowNewThread] = useState(false);
  const [postError, setPostError] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/discussions');
      setDiscussions(res.data);
    } catch (err) {
      console.error('Error fetching discussions:', err);
    }
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } })
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 p-6 bg-[#18181b] border-r border-gray-800 min-h-screen">
        <h3 className="text-lg font-semibold mb-4">Popular Tags</h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              className="px-3 py-1 rounded-full bg-gray-900 text-gray-300 text-xs hover:bg-purple-700 hover:text-white transition-colors border border-gray-800"
            >
              {tag}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6 border-b border-gray-800 bg-black/80 sticky top-0 z-40">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-2xl font-bold text-white">Game<span className="text-gray-500">Verse</span></span>
            <input
              type="text"
              placeholder="Search discussions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="ml-4 px-3 py-2 rounded bg-gray-900 text-gray-200 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full md:w-72"
          />
          </div>
          <button
            onClick={() => setShowNewThread(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition-colors"
          >
            <FaPlus /> New Thread
          </button>
        </div>

        {/* New Thread Modal */}
        {showNewThread && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#18181b] p-8 rounded-xl shadow-2xl border border-gray-800 w-full max-w-lg"
            >
              <h3 className="text-xl font-bold mb-4">Start a New Discussion</h3>
              <input
                className="w-full p-3 bg-gray-900 text-white rounded mb-4 border border-gray-800"
                type="text"
                placeholder="Thread Title"
                value={newThread.title}
                onChange={e => setNewThread({ ...newThread, title: e.target.value })}
              />
              <input
                className="w-full p-3 bg-gray-900 text-white rounded mb-4 border border-gray-800"
                type="text"
                placeholder="Tags (comma separated)"
                value={newThread.tags}
                onChange={e => setNewThread({ ...newThread, tags: e.target.value })}
              />
              <textarea
                className="w-full p-4 bg-gray-900 text-white rounded mb-4 border border-gray-800"
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
                  className="px-4 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => { setShowNewThread(false); setPostError(''); }}
                >Cancel</button>
                <button
                  className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePost}
                  disabled={!newThread.title.trim() || !newThread.content.trim()}
                >Post</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Discussions List */}
        <div className="max-w-3xl mx-auto w-full py-8 px-2">
          <h2 className="text-3xl font-bold mb-6">Discussions</h2>
          <div className="flex justify-end mb-4">
            <select className="bg-gray-900 text-gray-300 px-3 py-2 rounded border border-gray-800">
              <option>Hot</option>
              <option>Newest</option>
              <option>Top</option>
            </select>
          </div>
          <div className="space-y-6">
            {discussions.filter(d => d.content.toLowerCase().includes(search.toLowerCase())).map((d, i) => (
              <motion.div
                key={d._id || i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-4 border border-gray-800 hover:shadow-2xl transition-shadow relative"
              >
                {/* Upvote/Downvote */}
                <div className="flex flex-col items-center justify-start md:justify-center mr-2">
                  <button className="text-gray-400 hover:text-purple-500 transition-colors"><FaChevronUp /></button>
                  <span className="font-bold text-lg my-1">{d.upvotes || 0}</span>
                  <button className="text-gray-400 hover:text-pink-500 transition-colors"><FaChevronDown /></button>
                </div>
                {/* Main Card Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <img
                      src={d.avatar || `https://api.dicebear.com/6.x/bottts/svg?seed=${d.username}`}
                      alt="avatar"
                      className="w-7 h-7 rounded-full border-2 border-purple-500 object-cover"
                    />
                    <span className="font-semibold text-sm text-white">{d.username}</span>
                    {/* Example badge */}
                    {d.badge && (
                      <span className="ml-2 text-xs font-semibold text-purple-400">{d.badge}</span>
                    )}
                    {/* Example pinned */}
                    {d.pinned && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-purple-700 text-xs text-white font-bold">Pinned</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white hover:underline cursor-pointer transition-colors">
                      {d.title || d.content.slice(0, 40) + (d.content.length > 40 ? '...' : '')}
                    </h3>
                  </div>
                  <div className="text-gray-400 mt-1 mb-2">
                    {d.content}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(d.tags || []).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-gray-900 text-xs text-gray-300 border border-gray-800">{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1"><FaComment /> {d.commentsCount || 0} comments</div>
                    <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {/* Date (for desktop, right aligned) */}
                <div className="hidden md:block text-xs text-gray-500 absolute top-6 right-6">
                  {new Date(d.createdAt).toLocaleDateString()}
            </div>
              </motion.div>
          ))}
        </div>
      </div>
      </main>
    </div>
  );
};

export default Discussion;
