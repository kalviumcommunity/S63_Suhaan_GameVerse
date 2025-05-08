import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaCog, FaSignOutAlt, FaGamepad, FaSearch, FaHome, FaBars, FaTimes, FaComments, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/search', label: 'Search', icon: FaSearch },
    { path: '/discussions', label: 'Discussions', icon: FaComments },
    { path: '/wishlist', label: 'Wishlist', icon: FaHeart },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#181818]/80 backdrop-blur-lg border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-[#b91c1c] to-[#ef4444] p-2 rounded-lg shadow"
              >
                <FaGamepad className="text-2xl text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#b91c1c] via-[#ef4444] to-[#b91c1c] bg-clip-text text-transparent animate-gradient">
                GameVerse
              </span>
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-white p-2 rounded-lg hover:bg-[#b91c1c]/20"
            >
              {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(link.path) 
                      ? 'bg-gradient-to-r from-[#b91c1c]/80 to-[#ef4444]/80 text-white shadow-lg border border-[#b91c1c]/40' 
                      : 'text-gray-300 hover:text-white hover:bg-[#b91c1c]/20'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <motion.div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-[#b91c1c]/80 to-[#ef4444]/80 hover:from-[#b91c1c]/90 hover:to-[#ef4444]/90 text-white px-4 py-2 rounded-lg transition-all duration-300 border border-[#b91c1c]/40"
                >
                  <FaUser className="text-gray-300" />
                  <span>{user?.username || 'Profile'}</span>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-[#181818]/95 backdrop-blur-lg rounded-lg shadow-xl border border-[#b91c1c]/30 overflow-hidden"
                    >
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#b91c1c]/20 transition-colors"
                        >
                          <FaUser className="mr-2" />
                          My Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-gray-300 hover:bg-[#b91c1c]/20 transition-colors"
                        >
                          <FaCog className="mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-gray-300 hover:bg-[#b91c1c]/20 transition-colors"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/login')
                      ? 'bg-gradient-to-r from-[#b91c1c] to-[#ef4444] text-white'
                      : 'text-gray-300 hover:text-white hover:bg-[#b91c1c]/20'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive('/register')
                      ? 'bg-gradient-to-r from-[#b91c1c] to-[#ef4444] text-white'
                      : 'bg-gradient-to-r from-[#b91c1c]/20 to-[#ef4444]/20 text-white hover:from-[#b91c1c]/30 hover:to-[#ef4444]/30'
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-[#181818]/95 backdrop-blur-lg rounded-lg mt-2 overflow-hidden border border-[#b91c1c]/30"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive(link.path)
                          ? 'bg-gradient-to-r from-[#b91c1c]/80 to-[#ef4444]/80 text-white'
                          : 'text-gray-300 hover:text-white hover:bg-[#b91c1c]/20'
                      }`}
                    >
                      <Icon className="text-lg" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#b91c1c]/20 rounded-lg transition-colors"
                    >
                      <FaUser className="text-lg" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-[#b91c1c]/20 rounded-lg transition-colors"
                    >
                      <FaCog className="text-lg" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-gray-300 hover:text-white hover:bg-[#b91c1c]/20 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 px-4 py-2">
                    <Link
                      to="/login"
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive('/login')
                          ? 'bg-gradient-to-r from-[#b91c1c] to-[#ef4444] text-white'
                          : 'text-gray-300 hover:text-white hover:bg-[#b91c1c]/20'
                      }`}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                        isActive('/register')
                          ? 'bg-gradient-to-r from-[#b91c1c] to-[#ef4444] text-white'
                          : 'bg-gradient-to-r from-[#b91c1c]/20 to-[#ef4444]/20 text-white hover:from-[#b91c1c]/30 hover:to-[#ef4444]/30'
                      }`}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
