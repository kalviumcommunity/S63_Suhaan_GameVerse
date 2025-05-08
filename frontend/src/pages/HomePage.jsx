import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaArrowLeft, FaStar, FaHeart, FaGamepad, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { getGames, getPopularGames, getUpcomingGames } from '../services/rawgApi';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';
import { searchDeals } from '../services/cheapSharkApi';

// Loading screen component
const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] z-50 flex items-center justify-center"
    >
      <div className="relative w-40 h-40">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 border-4 border-[#3B82F6] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
            borderColor: ["#3B82F6", "#60A5FA", "#3B82F6"],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 border-4 border-[#60A5FA] rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: -360,
            borderColor: ["#60A5FA", "#3B82F6", "#60A5FA"],
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute inset-8 border-4 border-[#93C5FD] rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: 180,
            borderColor: ["#93C5FD", "#3B82F6", "#93C5FD"],
          }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
        />
        {/* Loading text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <div className="text-center">
            <span className="text-2xl font-['Orbitron'] text-[#3B82F6] block">Loading</span>
            <motion.span
              className="text-sm font-['Space_Grotesk'] text-[#60A5FA] block mt-2"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              Please wait...
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Content loader component
const ContentLoader = ({ children, isLoading }) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-64 flex items-center justify-center"
        >
          <div className="space-y-6 w-full max-w-md">
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#3B82F6]/10 via-[#60A5FA]/10 to-[#3B82F6]/10"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Loading bars */}
            <motion.div
              className="h-4 bg-[#3B82F6]/20 rounded-full w-full relative overflow-hidden"
              animate={{
                width: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
            <motion.div
              className="h-4 bg-[#3B82F6]/20 rounded-full w-3/4 relative overflow-hidden"
              animate={{
                width: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
            <motion.div
              className="h-4 bg-[#3B82F6]/20 rounded-full w-1/2 relative overflow-hidden"
              animate={{
                width: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.5,
            ease: [0.6, -0.05, 0.01, 0.99]
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] } },
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
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] } },
  whileHover: { 
    scale: 1.04, 
    boxShadow: '0 8px 32px 0 rgba(31, 41, 55, 0.25)',
    transition: { duration: 0.3 }
  },
};

const buttonVariants = {
  whileHover: {
    scale: 1.05,
    backgroundColor: '#2563EB',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1
    }
  }
};

const searchInputVariants = {
  whileFocus: {
    scale: 1.02,
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    transition: {
      duration: 0.2
    }
  }
};

const linkVariants = {
  whileHover: {
    scale: 1.05,
    color: '#60A5FA',
    transition: {
      duration: 0.2
    }
  }
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

// Text animation variants
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const titleVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.6, -0.05, 0.01, 0.99],
      staggerChildren: 0.1
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99]
    }
  }
};

const gradientTextVariants = {
  hidden: { backgroundPosition: '0% 50%' },
  visible: {
    backgroundPosition: '100% 50%',
    transition: {
      duration: 3,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'reverse'
    }
  }
};

const AnimatedText = ({ text, className, variants = textVariants }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className={className}
    >
      {text}
    </motion.div>
  );
};

const AnimatedTitle = ({ text, className }) => {
  return (
    <motion.h1
      initial="hidden"
      animate="visible"
      variants={titleVariants}
      className={className + " break-keep whitespace-normal"}
    >
      {text.split(' ').map((word, wordIdx) => (
        <motion.span
          key={wordIdx}
          variants={letterVariants}
          style={{ display: 'inline-block', marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
};

const GradientText = ({ text, className }) => {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={gradientTextVariants}
      className={`${className} bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent bg-[length:200%_auto]`}
    >
      {text}
    </motion.span>
  );
};

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trendingGames, setTrendingGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gamePrices, setGamePrices] = useState({});
  const exchangeRate = 83.5; // USD to INR rate

  // Add refs for scroll animations
  const trendingRef = useRef(null);
  const upcomingRef = useRef(null);
  const featuredRef = useRef(null);

  // Check if sections are in view
  const trendingInView = useInView(trendingRef, { once: true, margin: "0px 0px -200px 0px", amount: 0.2 });
  const upcomingInView = useInView(upcomingRef, { once: true, margin: "0px 0px -200px 0px", amount: 0.2 });
  const featuredInView = useInView(featuredRef, { once: true, margin: "0px 0px -200px 0px", amount: 0.2 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [popularData, upcomingData] = await Promise.all([
          getPopularGames(),
          getUpcomingGames()
        ]);

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
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPrices = async () => {
      const prices = {};
      for (const game of [...trendingGames, ...upcomingGames]) {
        try {
          const deals = await searchDeals(game.name);
          if (deals && deals.length > 0) {
            const bestDeal = deals.reduce((min, deal) => 
              parseFloat(deal.salePrice) < parseFloat(min.salePrice) ? deal : min
            );
            prices[game.id] = {
              salePrice: bestDeal.salePrice,
              normalPrice: bestDeal.normalPrice,
              isOnSale: bestDeal.salePrice !== bestDeal.normalPrice
            };
          }
        } catch (error) {
          console.error(`Error fetching price for ${game.name}:`, error);
        }
      }
      setGamePrices(prices);
    };

    if (trendingGames.length > 0 || upcomingGames.length > 0) {
      fetchPrices();
    }
  }, [trendingGames, upcomingGames]);

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

  const convertToINR = (usdPrice) => {
    return (usdPrice * exchangeRate).toFixed(2);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] text-white font-['Space_Grotesk']"
    >
      {/* Hero Section with Split Layout */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ scale, opacity }}
            className="absolute inset-0"
          >
            {trendingGames[0]?.background_image ? (
              <motion.img
                src={trendingGames[0].background_image}
                alt="Hero"
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, ease: [0.6, -0.05, 0.01, 0.99] }}
              />
            ) : (
              <div className="w-full h-full bg-black animate-pulse" />
            )}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-[#b91c1c]/80 via-transparent to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </motion.div>
        </div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#ef4444]/20 text-[#ef4444] text-sm font-medium rounded-full mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ 
                  scale: 1.05, 
                  backgroundColor: '#ef4444', 
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                <motion.span 
                  className="w-2 h-2 bg-[#ef4444] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <GradientText text="Featured Release" className="font-medium" />
              </motion.div>
              <AnimatedTitle
                text="Experience Gaming Like Never Before"
                className="text-5xl sm:text-7xl font-bold mb-6 leading-tight font-['Orbitron'] text-white"
              />
              <AnimatedText
                text="Discover a world of immersive gaming experiences. From action-packed adventures to strategic masterpieces."
                className="text-xl text-gray-300 mb-12 max-w-xl font-['Inter']"
              />
              <motion.form 
                onSubmit={handleSearch} 
                className="flex flex-col sm:flex-row items-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
              >
                <motion.input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-full max-w-md bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg border border-[#ef4444]/40 focus:outline-none focus:border-[#ef4444] transition-all"
                  variants={searchInputVariants}
                  whileFocus="whileFocus"
                />
                <motion.button
                  variants={buttonVariants}
                  whileHover="whileHover"
                  whileTap="whileTap"
                  type="submit"
                  className="w-full sm:w-auto bg-[#ef4444] text-white px-8 py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-all hover:bg-[#b91c1c] focus:ring-2 focus:ring-[#ef4444]/50"
                >
                  <FaSearch />
                  <span>Search</span>
                </motion.button>
              </motion.form>
            </motion.div>
            {/* Right Column - Featured Game */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative hidden lg:block"
            >
              {trendingGames[0] && (
                <motion.div
                  className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ef4444]/30 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => navigate(`/game/${trendingGames[0].id}`)}
                >
                  <img 
                    src={trendingGames[0].background_image} 
                    alt={trendingGames[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.h3 
                      className="text-2xl font-bold mb-2 text-[#ef4444]"
                      whileHover={{ color: '#b91c1c' }}
                    >
                      {trendingGames[0].name}
                    </motion.h3>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <span className="flex items-center gap-1">
                        <span className="text-[#ef4444]">★</span>
                        {trendingGames[0].rating}
                      </span>
                      <span>•</span>
                      <span>{trendingGames[0].genres?.[0]?.name || 'Action'}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      {/* Trending Games Section with Carousel */}
      <section className="py-24 bg-[#1a1a1a]/90" ref={trendingRef}>
        <div className="container mx-auto px-8">
          <ContentLoader isLoading={isLoading}>
            <motion.div 
              className="flex items-center justify-between mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AnimatedTitle
                text="Trending Now"
                className="text-4xl font-bold font-['Orbitron'] text-[#ef4444]"
              />
              <motion.div variants={linkVariants} whileHover="whileHover">
                <Link to="/browse" className="text-[#ef4444] hover:text-[#b91c1c] transition-colors group">
                  <GradientText text="View All" className="mr-2" />
                  <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {trendingGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  variants={cardVariants}
                  className="group cursor-pointer bg-[#181818] border-2 border-[#ef4444]/20 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover="whileHover"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
                    <motion.img 
                      src={game.background_image} 
                      alt={game.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <motion.button 
                          className="w-full py-3 bg-[#ef4444] hover:bg-[#b91c1c] transition-colors rounded-lg font-medium shadow-md"
                          variants={buttonVariants}
                          whileHover="whileHover"
                          whileTap="whileTap"
                          onClick={e => { e.stopPropagation(); navigate(`/game/${game.id}`); }}
                        >
                          View Game
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <motion.h3 
                        className="text-xl font-medium group-hover:text-[#ef4444] transition-colors"
                        whileHover={{ color: '#b91c1c' }}
                      >
                        {game.name}
                      </motion.h3>
                      {gamePrices[game.id] && (
                        <motion.span 
                          className="text-[#ef4444] font-medium"
                          whileHover={{ color: '#b91c1c' }}
                        >
                          ₹{convertToINR(gamePrices[game.id].salePrice)}
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <motion.div 
                        className="flex items-center gap-1"
                        whileHover={{ color: '#fff' }}
                      >
                        <span className="text-[#ef4444]">★</span>
                        <span>{game.rating}</span>
                      </motion.div>
                      <span>•</span>
                      <motion.div
                        whileHover={{ color: '#fff' }}
                      >
                        {game.genres?.[0]?.name || 'Action'}
                      </motion.div>
                      <span>•</span>
                      <motion.div 
                        className="text-xs"
                        whileHover={{ color: '#fff' }}
                      >
                        {game.platforms?.[0]?.platform.name || 'PC'}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </ContentLoader>
        </div>
      </section>
      {/* Upcoming Games Section with Timeline */}
      <section className="py-24 bg-[#1a1a1a]/90" ref={upcomingRef}>
        <div className="container mx-auto px-8">
          <ContentLoader isLoading={isLoading}>
            <motion.div 
              className="flex items-center justify-between mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AnimatedTitle
                text="Coming Soon"
                className="text-4xl font-bold font-['Orbitron'] text-[#ef4444]"
              />
              <motion.div variants={linkVariants} whileHover="whileHover">
                <Link to="/browse" className="text-[#ef4444] hover:text-[#b91c1c] transition-colors group">
                  <GradientText text="View All" className="mr-2" />
                  <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                </Link>
              </motion.div>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {upcomingGames.slice(0, 3).map((game, index) => (
                  <motion.div
                    key={game.id}
                    className="flex gap-6 items-start group cursor-pointer bg-[#181818] border-2 border-[#ef4444]/20 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/game/${game.id}`)}
                  >
                    <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                      <img 
                        src={game.background_image} 
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl font-medium mb-2 group-hover:text-[#ef4444] transition-colors"
                        whileHover={{ color: '#b91c1c' }}
                      >
                        {game.name}
                      </motion.h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <span className="text-[#ef4444]">★</span>
                          {game.rating}
                        </span>
                        <span>•</span>
                        <span>{game.genres?.[0]?.name || 'Action'}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative hidden lg:block"
              >
                {upcomingGames[0] && (
                  <motion.div
                    className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ef4444]/30"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={upcomingGames[0].background_image} 
                      alt={upcomingGames[0].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <motion.h3 
                        className="text-2xl font-bold mb-2 text-[#ef4444]"
                        whileHover={{ color: '#b91c1c' }}
                      >
                        {upcomingGames[0].name}
                      </motion.h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                          <span className="text-[#ef4444]">★</span>
                          {upcomingGames[0].rating}
                        </span>
                        <span>•</span>
                        <span>{upcomingGames[0].genres?.[0]?.name || 'Action'}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </ContentLoader>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-[#ef4444]/20 bg-black">
        <div className="container mx-auto px-8">
          <ContentLoader isLoading={isLoading}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GradientText
                  text="GameVerse"
                  className="text-2xl font-bold mb-4 font-['Orbitron'] text-[#ef4444]"
                />
                <AnimatedText
                  text="Your gateway to endless gaming adventures."
                  className="text-gray-400"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h4 className="text-lg font-medium mb-4 text-[#ef4444]">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/about" className="hover:text-[#ef4444] transition-colors">About Us</Link></li>
                  <li><Link to="/contact" className="hover:text-[#ef4444] transition-colors">Contact</Link></li>
                  <li><Link to="/support" className="hover:text-[#ef4444] transition-colors">Support</Link></li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="text-lg font-medium mb-4 text-[#ef4444]">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/privacy" className="hover:text-[#ef4444] transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-[#ef4444] transition-colors">Terms of Service</Link></li>
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h4 className="text-lg font-medium mb-4 text-[#ef4444]">Connect</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-[#ef4444] transition-colors">Discord</a></li>
                  <li><a href="#" className="hover:text-[#ef4444] transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-[#ef4444] transition-colors">Instagram</a></li>
                </ul>
              </motion.div>
            </div>
          </ContentLoader>
        </div>
      </footer>
    </motion.div>
  );
};

export default HomePage; 