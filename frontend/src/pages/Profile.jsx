import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWishlist } from '../services/wishlistService';
import { FaStar, FaHeart, FaGamepad, FaEdit, FaTrophy, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [isEditing, setIsEditing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    hoursPlayed: 0,
    achievements: 0,
    reviews: 0
  });

  // Get the user's display name or fallback to email username
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  useEffect(() => {
    setWishlist(getWishlist());
    setStats({
      gamesPlayed: 12,
      hoursPlayed: 156,
      achievements: 45,
      reviews: 8
    });
  }, []);

  const tabs = [
    { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
    { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
    { id: 'collection', label: 'Collection', icon: <FaGamepad /> },
    { id: 'achievements', label: 'Achievements', icon: <FaTrophy /> }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-800 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-2 border-purple-500 bg-gradient-to-br from-gray-900 via-purple-900 to-black shadow-lg transition-transform group-hover:scale-105">
                <UserIcon className="w-20 h-20 text-white/90" />
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-purple-700"
              >
                <FaEdit />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {getUserDisplayName()}
              </h2>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-gray-800/70">
                  <div className="text-2xl font-bold text-purple-400">{stats.gamesPlayed}</div>
                  <div className="text-sm text-gray-400">Games</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-gray-800/70">
                  <div className="text-2xl font-bold text-purple-400">{stats.hoursPlayed}</div>
                  <div className="text-sm text-gray-400">Hours</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-gray-800/70">
                  <div className="text-2xl font-bold text-purple-400">{stats.achievements}</div>
                  <div className="text-sm text-gray-400">Achievements</div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-3 text-center transform transition-all hover:scale-105 hover:bg-gray-800/70">
                  <div className="text-2xl font-bold text-purple-400">{stats.reviews}</div>
                  <div className="text-sm text-gray-400">Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'bg-gray-900/50 text-gray-400 hover:bg-gray-800/70 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 shadow-2xl"
        >
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaHeart className="text-pink-500" /> Wishlisted Games
              </h3>
          {wishlist.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No games in your wishlist yet.</div>
          ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map(game => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={game.id}
                      className="bg-gray-900/50 rounded-lg overflow-hidden shadow-lg group"
                    >
                      <div className="relative h-40">
                        <img
                          src={game.background_image}
                          alt={game.name}
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      </div>
                      <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold leading-tight">{game.name}</span>
                          <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold ml-2">
                            <FaStar /> {game.rating || 'N/A'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {game.released ? new Date(game.released).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
        <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaStar className="text-yellow-400" /> Your Reviews
              </h3>
          {reviews.length === 0 ? (
                <div className="text-gray-500 text-center py-8">You haven't written any reviews yet.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                    <div key={review.id} className="bg-gray-900/50 rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800/70">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">{review.game}</span>
                        <span className="flex items-center gap-1 text-xs text-yellow-400">
                          <FaStar /> {review.rating}/5
                        </span>
                  </div>
                  <p className="text-gray-300">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
          )}

          {activeTab === 'collection' && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaGamepad className="text-purple-400" /> Game Collection
              </h3>
              <div className="text-gray-500 text-center py-8">
                Your game collection will appear here.
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaTrophy className="text-yellow-400" /> Achievements
              </h3>
              <div className="text-gray-500 text-center py-8">
                Your achievements will appear here.
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
