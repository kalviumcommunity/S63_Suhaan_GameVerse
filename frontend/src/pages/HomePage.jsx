import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaArrowLeft, FaStar, FaHeart, FaGamepad, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { getGames, getPopularGames, getUpcomingGames } from '../services/rawgApi';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  whileHover: { scale: 1.04, boxShadow: '0 8px 32px 0 rgba(80,0,120,0.25)' },
};

const heroTextVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingGames, setTrendingGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Add refs for scroll animations
  const trendingRef = useRef(null);
  const upcomingRef = useRef(null);
  const featuredRef = useRef(null);

  // Check if sections are in view
  const trendingInView = useInView(trendingRef, { once: true, margin: "0px 0px -200px 0px", amount: 0.2 });
  const upcomingInView = useInView(upcomingRef, { once: true, margin: "0px 0px -200px 0px", amount: 0.2 });
  const featuredInView = useInView(featuredRef, { once: true, margin: "0px 0px -200px 0px", amount: 0.2 });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        const [popularData, upcomingData] = await Promise.all([
          getPopularGames(),
          getUpcomingGames()
        ]);

        // Add wishlist status to games
        const popularWithWishlist = popularData.results.map(game => ({
          ...game,
          isWishlisted: isInWishlist(game.id)
        }));

        const upcomingWithWishlist = upcomingData.results.map(game => ({
          ...game,
          isWishlisted: isInWishlist(game.id)
        }));

        setTrendingGames(popularWithWishlist.slice(0, 6));
        setUpcomingGames(upcomingWithWishlist.slice(0, 3));
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWishlistClick = (e, game) => {
    e.stopPropagation();
    const isCurrentlyWishlisted = isInWishlist(game.id);
    
    if (isCurrentlyWishlisted) {
      removeFromWishlist(game.id);
    } else {
      addToWishlist(game);
    }

    // Update trending games
    setTrendingGames(prev => prev.map(g => 
      g.id === game.id ? { ...g, isWishlisted: !isCurrentlyWishlisted } : g
    ));

    // Update upcoming games
    setUpcomingGames(prev => prev.map(g => 
      g.id === game.id ? { ...g, isWishlisted: !isCurrentlyWishlisted } : g
    ));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white"
    >
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {trendingGames[0]?.background_image ? (
            <motion.img
              src={trendingGames[0].background_image}
              alt="Hero"
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
          ) : (
            <div className="w-full h-full bg-gray-900 animate-pulse" />
          )}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" 
          />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center max-w-4xl"
          >
            <motion.h1 
              className="text-4xl sm:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Discover Your Next Adventure
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Explore thousands of games, from indie gems to AAA titles
            </motion.p>
            <motion.form 
              onSubmit={handleSearch} 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <motion.input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full max-w-md bg-black/50 backdrop-blur-md text-white px-6 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-all"
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                whileHover={{ scale: 1.07, backgroundColor: '#a21caf' }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-all"
              >
                <FaSearch />
                <span>Search</span>
              </motion.button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center items-center h-64"
          >
            <motion.div 
              className="h-16 w-16 border-4 border-purple-500 rounded-full border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Trending Games Section */}
          <motion.section 
            variants={fadeInUp}
            className="py-16 px-4 sm:px-12"
          >
            <div className="container mx-auto">
              <motion.h2 
                className="text-3xl font-bold mb-8 flex items-center gap-3"
                variants={fadeInUp}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <FaGamepad className="text-purple-500" />
                </motion.span>
                Trending Games
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
              >
                {trendingGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover={{ scale: 1.05, y: -8, boxShadow: '0 8px 32px 0 rgba(80,0,120,0.25)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer transform-gpu group"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-48 object-cover transition-all duration-300"
                        whileHover={{ scale: 1.12, filter: 'brightness(1.15)' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleWishlistClick(e, game)}
                          className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                            game.isWishlisted ? 'bg-red-600' : 'bg-gray-800'
                          }`}
                        >
                          <FaHeart className={game.isWishlisted ? "text-white" : "text-gray-400"} />
                        </motion.button>
                      </div>
                    </div>
                    <motion.div 
                      className="p-4"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-400 transition-colors duration-200">{game.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">
                          {game.genres?.map(genre => genre.name).join(', ')}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* Upcoming Games Section */}
          <motion.section
            variants={fadeInUp}
            className="py-16 px-4 sm:px-12 bg-gradient-to-b from-gray-900/50 to-black"
          >
            <div className="container mx-auto">
              <motion.h2 
                className="text-3xl font-bold mb-8 flex items-center gap-3"
                variants={fadeInUp}
              >
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FaArrowRight className="text-purple-500" />
                </motion.span>
                Upcoming Releases
              </motion.h2>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={staggerContainer}
              >
                {upcomingGames.map((game, index) => (
                  <motion.div
                    key={game.id}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    whileHover={{ scale: 1.05, y: -8, boxShadow: '0 8px 32px 0 rgba(80,0,120,0.25)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer transform-gpu group"
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={game.background_image}
                        alt={game.name}
                        className="w-full h-48 object-cover transition-all duration-300"
                        whileHover={{ scale: 1.12, filter: 'brightness(1.15)' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                      />
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleWishlistClick(e, game)}
                          className={`p-2 rounded-full shadow-lg transition-all duration-200 ${
                            game.isWishlisted ? 'bg-red-600' : 'bg-gray-800'
                          }`}
                        >
                          <FaHeart className={game.isWishlisted ? "text-white" : "text-gray-400"} />
                        </motion.button>
                      </div>
                    </div>
                    <motion.div 
                      className="p-4"
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold group-hover:text-purple-400 transition-colors duration-200">
                        {game.name}
                      </h3>
                      <p className="text-gray-400 mt-2">
                        Release: {new Date(game.released).toLocaleDateString()}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>
        </motion.div>
      )}

      {/* Footer */}
      <motion.footer 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="bg-black py-8 px-12 border-t border-gray-800"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={fadeInUp}>
              <h3 className="text-xl font-bold mb-4">GameVerse</h3>
              <p className="text-gray-400">Your ultimate gaming destination</p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <motion.li whileHover={{ x: 5, color: "#fff" }}>
                  <a href="#" className="transition-colors">About Us</a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#fff" }}>
                  <a href="#" className="transition-colors">Contact</a>
                </motion.li>
                <motion.li whileHover={{ x: 5, color: "#fff" }}>
                  <a href="#" className="transition-colors">Privacy Policy</a>
                </motion.li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5, color: "#1DA1F2" }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-gray-400 transition-colors"
                >
                  <FaTwitter size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5, color: "#4267B2" }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-gray-400 transition-colors"
                >
                  <FaFacebook size={24} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5, color: "#E1306C" }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="text-gray-400 transition-colors"
                >
                  <FaInstagram size={24} />
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};

export default HomePage; 