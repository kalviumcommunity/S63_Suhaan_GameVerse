import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWishlist } from '../services/wishlistService';
import { uploadProfilePicture, updateProfile } from '../services/userService';
import { FaStar, FaHeart, FaGamepad, FaEdit, FaTrophy, FaChartBar, FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [imageError, setImageError] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    gamesPlayed: 0,
    hoursPlayed: 0,
    achievements: 0,
    reviews: 0
  });
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Get the user's display name or fallback to email username
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setImageError(false);
      
      if (!token) {
        throw new Error('You must be logged in to upload a profile picture');
      }

      const response = await uploadProfilePicture(file, token);
      console.log('Upload response:', response); // Debug log
      
      if (response.profilePic) {
        console.log('Setting new profile pic:', response.profilePic); // Debug log
        setProfilePic(response.profilePic);
        if (user) {
          user.profilePic = response.profilePic;
        }
        toast.success('Profile picture updated successfully');
      } else {
        throw new Error('No profile picture URL in response');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setImageError(true);
      toast.error(error.response?.data?.message || error.message || 'Failed to update profile picture');
    } finally {
      setIsUploading(false);
      setIsEditing(false);
    }
  };

  // Update profilePic state when user changes
  useEffect(() => {
    if (user?.profilePic) {
      console.log('Updating profile pic from user:', user.profilePic); // Debug log
      setProfilePic(user.profilePic);
      setImageError(false);
    }
  }, [user]);

  const handleImageError = () => {
    console.log('Image failed to load:', profilePic); // Debug log
    setImageError(true);
    setProfilePic('');
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

  const handleProfileEdit = () => {
    setIsEditing(true);
    setProfileData({
      displayName: user?.displayName || '',
      bio: user?.bio || ''
    });
  };

  const handleProfileSave = async () => {
    try {
      setIsSaving(true);
      const response = await updateProfile(profileData, token);
      if (response.user) {
        updateUser(response.user);
        toast.success('Profile updated successfully');
      }
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileCancel = () => {
    setIsEditing(false);
    setProfileData({
      displayName: user?.displayName || '',
      bio: user?.bio || ''
    });
  };

  const tabs = [
    { id: 'wishlist', label: 'Wishlist', icon: <FaHeart /> },
    { id: 'reviews', label: 'Reviews', icon: <FaStar /> },
    { id: 'collection', label: 'Collection', icon: <FaGamepad /> },
    { id: 'achievements', label: 'Achievements', icon: <FaTrophy /> }
  ];

  return (
    <div className="min-h-screen w-full h-full relative overflow-x-hidden bg-gradient-to-br from-[#181818] via-[#b91c1c]/30 to-[#181818] flex flex-col">
      {/* Animated, blurred background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 -z-10 bg-gradient-to-br from-[#b91c1c]/40 via-[#181818]/60 to-[#b91c1c]/40 blur-2xl opacity-60 animate-pulse"
      />
      {/* Frosted Glass Profile Card - now full width */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full flex flex-col items-center justify-center rounded-none bg-white/10 backdrop-blur-lg shadow-2xl border-b border-white/20 p-8 pt-20"
        style={{ minHeight: '40vh' }}
      >
        <div className="relative mb-4">
          <motion.div
            initial={{ boxShadow: '0 0 0 0 #b91c1c' }}
            animate={{ boxShadow: '0 0 24px 4px #b91c1c' }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
            className="rounded-full"
          >
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#b91c1c] shadow-lg overflow-hidden bg-[#181818] flex items-center justify-center">
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#b91c1c]/40"></div>
                  </div>
                ) : profilePic && !imageError ? (
                  <img 
                    src={profilePic}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <UserIcon className="w-20 h-20 text-white/90" />
                )}
              </div>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#991b1b' }}
            transition={{ type: 'spring', stiffness: 300 }}
                onClick={() => {
                  if (!isUploading) {
                    setIsEditing(!isEditing);
                    if (!isEditing) {
                      fileInputRef.current?.click();
                    }
                  }
                }}
                disabled={isUploading}
            className={`absolute bottom-2 right-2 bg-[#b91c1c] p-2 rounded-full shadow-lg border-2 border-[#b91c1c]/40 text-white transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
              >
                <FaEdit />
          </motion.button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
            </div>
        {isEditing ? (
          <div className="w-full max-w-md mx-auto mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Display Name</label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-[#b91c1c]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/50"
                placeholder="Enter display name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full px-4 py-2 bg-white/10 border border-[#b91c1c]/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/50"
                placeholder="Tell us about yourself"
                rows="3"
                maxLength="500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                disabled={isSaving}
              >
                <FaTimes className="inline-block mr-2" />
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleProfileSave}
                className="px-4 py-2 bg-[#b91c1c] text-white rounded-lg hover:bg-[#991b1b] transition-colors"
                disabled={isSaving}
              >
                <FaSave className="inline-block mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-3xl sm:text-4xl font-bold font-['Orbitron'] text-white mb-1 text-center"
            >
              {getUserDisplayName()}
            </motion.h2>
            {user?.bio && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-gray-300 font-['Inter'] mb-2 text-center max-w-md mx-auto"
              >
                {user.bio}
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleProfileEdit}
              className="mt-4 px-4 py-2 bg-[#b91c1c]/80 text-white rounded-lg hover:bg-[#b91c1c] transition-colors"
            >
              <FaEdit className="inline-block mr-2" />
              Edit Profile
            </motion.button>
          </>
        )}
        {/* Stats Row */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 max-w-6xl mx-auto">
          <motion.div whileHover={{ scale: 1.07, rotate: -2 }} className="backdrop-blur bg-white/10 border border-[#b91c1c]/30 rounded-xl p-4 flex flex-col items-center shadow-lg transition-all">
            <FaGamepad className="text-2xl text-[#dc2626] mb-1" />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.7 }} className="text-2xl font-bold text-[#dc2626] font-['Orbitron']">{stats.gamesPlayed}</motion.div>
            <div className="text-xs text-gray-400 font-['Inter']">Games</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07, rotate: 2 }} className="backdrop-blur bg-white/10 border border-[#b91c1c]/30 rounded-xl p-4 flex flex-col items-center shadow-lg transition-all">
            <FaChartBar className="text-2xl text-[#dc2626] mb-1" />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-2xl font-bold text-[#dc2626] font-['Orbitron']">{stats.hoursPlayed}</motion.div>
            <div className="text-xs text-gray-400 font-['Inter']">Hours</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07, rotate: -2 }} className="backdrop-blur bg-white/10 border border-[#b91c1c]/30 rounded-xl p-4 flex flex-col items-center shadow-lg transition-all">
            <FaTrophy className="text-2xl text-[#dc2626] mb-1" />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-2xl font-bold text-[#dc2626] font-['Orbitron']">{stats.achievements}</motion.div>
            <div className="text-xs text-gray-400 font-['Inter']">Achievements</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.07, rotate: 2 }} className="backdrop-blur bg-white/10 border border-[#b91c1c]/30 rounded-xl p-4 flex flex-col items-center shadow-lg transition-all">
            <FaStar className="text-2xl text-[#dc2626] mb-1" />
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-2xl font-bold text-[#dc2626] font-['Orbitron']">{stats.reviews}</motion.div>
            <div className="text-xs text-gray-400 font-['Inter']">Reviews</div>
          </motion.div>
        </div>
      </motion.div>
      {/* Tabs */}
      <div className="w-full flex-1 px-4 mt-12">
        <div className="flex flex-nowrap gap-3 mb-8 justify-center overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
            <motion.button
                key={tab.id}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
                onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-['Orbitron'] font-semibold text-base transition-all duration-200 border-2 border-[#b91c1c]/30 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/40 backdrop-blur-lg ${
                  activeTab === tab.id 
                  ? 'bg-[#b91c1c]/90 text-white scale-105 shadow-lg'
                  : 'bg-white/10 text-[#b91c1c] hover:bg-[#b91c1c]/80 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
            </motion.button>
            ))}
          </div>
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="min-h-[300px] w-full max-w-7xl mx-auto"
          >
          {activeTab === 'wishlist' && (
            <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-['Orbitron'] text-[#b91c1c]">
                <FaHeart className="text-[#b91c1c]" /> Wishlist
              </h3>
              {wishlist.length === 0 ? (
                  <div className="text-gray-400 text-center py-12">Your wishlist is empty.</div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {wishlist.map(game => (
                      <motion.div
                        key={game.id}
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 #b91c1c55' }}
                        className="relative bg-white/10 border-2 border-[#b91c1c]/30 rounded-2xl shadow-xl overflow-hidden flex flex-col group cursor-pointer backdrop-blur-lg transition-all"
                        onClick={() => navigate(`/game/${game.id}`)}
                      >
                        <div className="relative w-full aspect-[16/9] bg-[#222] overflow-hidden">
                          {game.background_image ? (
                            <img src={game.background_image} alt={game.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#b91c1c]/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                          <div className="absolute top-2 right-2 bg-[#b91c1c]/80 text-white text-xs px-2 py-1 rounded-full font-bold shadow">{game.genres?.[0]?.name || 'Action'}</div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                      <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-[#dc2626] font-['Orbitron']">{game.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                          <FaStar className="text-[#b91c1c]" /> {game.rating}
                            </div>
                      </div>
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#991b1b' }}
                            className="mt-2 w-full py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg font-semibold transition-all shadow-lg"
                            onClick={e => { e.stopPropagation(); navigate(`/game/${game.id}`); }}
                          >
                            View Game
                          </motion.button>
                    </div>
                      </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-['Orbitron'] text-[#b91c1c]">
                <FaStar className="text-[#b91c1c]" /> Your Reviews
              </h3>
              {reviews.length === 0 ? (
                  <div className="text-gray-400 text-center py-12">You haven't written any reviews yet.</div>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {reviews.map(review => (
                      <motion.div
                        key={review.id}
                        whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 #b91c1c55' }}
                        className="relative bg-white/10 border-2 border-[#b91c1c]/30 rounded-2xl shadow-xl overflow-hidden flex flex-col group cursor-pointer backdrop-blur-lg transition-all"
                      >
                        <div className="relative w-full aspect-[16/9] bg-[#222] overflow-hidden">
                          {review.background_image ? (
                            <img src={review.background_image} alt={review.game} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#b91c1c]/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                          <div className="absolute top-2 right-2 bg-[#b91c1c]/80 text-white text-xs px-2 py-1 rounded-full font-bold shadow">{review.rating}/5</div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-lg text-[#dc2626] font-['Orbitron'] mb-1">{review.game}</div>
                            <div className="text-gray-300 text-sm font-['Inter'] mb-2">{review.text}</div>
                      </div>
                          <motion.button
                            whileHover={{ scale: 1.05, backgroundColor: '#991b1b' }}
                            className="mt-2 w-full py-2 bg-[#b91c1c] hover:bg-[#991b1b] text-white rounded-lg font-semibold transition-all shadow-lg"
                            onClick={e => { e.stopPropagation(); navigate(`/game/${review.gameId}`); }}
                          >
                            View Game
                          </motion.button>
                    </div>
                      </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'collection' && (
            <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-['Orbitron'] text-[#b91c1c]">
                <FaGamepad className="text-[#b91c1c]" /> Game Collection
              </h3>
                <div className="text-gray-400 text-center py-12">
                Your game collection will appear here.
              </div>
            </div>
          )}
          {activeTab === 'achievements' && (
            <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-['Orbitron'] text-[#b91c1c]">
                <FaTrophy className="text-[#b91c1c]" /> Achievements
              </h3>
                <div className="text-gray-400 text-center py-12">
                Your achievements will appear here.
              </div>
            </div>
          )}
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
