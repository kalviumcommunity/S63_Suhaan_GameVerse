import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaSearch, FaHeart, FaFilter, FaChevronDown } from 'react-icons/fa';
import { 
  getGames, 
  searchGames, 
  getGamesByGenre, 
  getGamesByPlatform, 
  getGamesByRating,
  getGenres,
  getPlatforms 
} from '../services/rawgApi';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';

const SearchPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [gamesData, genresData, platformsData] = await Promise.all([
        getGames(page),
        getGenres(),
        getPlatforms()
      ]);
      
      setGames(gamesData.results.map(game => ({
        ...game,
        isWishlisted: isInWishlist(game.id)
      })));
      
      setGenres(genresData.results);
      setPlatforms(platformsData.results);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredGames = async () => {
    try {
      setLoading(true);
      let data;

      if (searchQuery.trim()) {
        data = await searchGames(searchQuery, page);
      } else if (selectedGenre !== 'All Genres') {
        const genre = genres.find(g => g.name === selectedGenre);
        data = await getGamesByGenre(genre.id, page);
      } else if (selectedPlatform !== 'All Platforms') {
        const platform = platforms.find(p => p.name === selectedPlatform);
        data = await getGamesByPlatform(platform.id, page);
      } else if (selectedRating !== 'All Ratings') {
        const minRating = parseInt(selectedRating);
        data = await getGamesByRating(minRating, page);
      } else {
        data = await getGames(page);
      }

      const gamesWithWishlist = data.results.map(game => ({
        ...game,
        isWishlisted: isInWishlist(game.id)
      }));
      setGames(gamesWithWishlist);
    } catch (error) {
      console.error('Error fetching filtered games:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredGames();
  }, [page, selectedGenre, selectedPlatform, selectedRating]);

  // Debounced live search effect
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        setPage(1);
        fetchFilteredGames();
      }
    }, 300);
    return () => clearTimeout(debounceTimeout.current);
    // eslint-disable-next-line
  }, [searchQuery]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setPage(1);
    await fetchFilteredGames();
  };

  const handleWishlistClick = (e, game) => {
    e.stopPropagation();
    const updatedGames = games.map(g => {
      if (g.id === game.id) {
        const newWishlistStatus = !g.isWishlisted;
        if (newWishlistStatus) {
          addToWishlist(game);
        } else {
          removeFromWishlist(game.id);
        }
        return { ...g, isWishlisted: newWishlistStatus };
      }
      return g;
    });
    setGames(updatedGames);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#1a1a1a] text-white pt-20 p-4 md:p-6 font-['Space_Grotesk']">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section with Search */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#b91c1c] to-[#ef4444] bg-clip-text text-transparent"
          >
            Discover Your Next Game
          </motion.h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full bg-[#181818] text-white pl-12 pr-6 py-4 rounded-xl border border-[#b91c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:border-transparent transition-all duration-300 font-['Inter'] shadow-lg"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b91c1c]" />
            </div>
          </form>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#181818] border border-[#b91c1c]/30 hover:border-[#b91c1c] transition-all duration-300"
            >
              <FaFilter className="text-[#b91c1c]" />
              <span>Filters</span>
              <FaChevronDown className={`transform transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <div className="text-sm text-gray-400">
              {games.length} games found
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-6 rounded-xl bg-[#181818]/80 backdrop-blur-sm border border-[#b91c1c]/30"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#b91c1c]">Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg border border-[#b91c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#b91c1c]"
                    >
                      <option value="All Genres">All Genres</option>
                      {genres.map(genre => (
                        <option key={genre.id} value={genre.name}>{genre.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#b91c1c]">Platform</label>
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg border border-[#b91c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#b91c1c]"
                    >
                      <option value="All Platforms">All Platforms</option>
                      {platforms.map(platform => (
                        <option key={platform.id} value={platform.name}>{platform.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#b91c1c]">Rating</label>
                    <select
                      value={selectedRating}
                      onChange={(e) => setSelectedRating(e.target.value)}
                      className="w-full bg-[#181818] text-white px-4 py-2 rounded-lg border border-[#b91c1c]/30 focus:outline-none focus:ring-2 focus:ring-[#b91c1c]"
                    >
                      <option value="All Ratings">All Ratings</option>
                      <option value="4">4+ Stars</option>
                      <option value="3">3+ Stars</option>
                      <option value="2">2+ Stars</option>
                      <option value="1">1+ Stars</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center h-64"
          >
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#b91c1c] border-t-transparent"></div>
          </motion.div>
        )}

        {/* Game Grid */}
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.div
              key={`${selectedGenre}-${selectedPlatform}-${selectedRating}-${searchQuery}-${page}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {games.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.07 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/game/${game.id}`)}
                >
                  <div className="relative overflow-hidden rounded-xl bg-[#181818] aspect-square">
                    <img
                      src={game.background_image}
                      alt={game.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400">★</span>
                            <span className="text-gray-200">{game.rating}</span>
                            <span className="text-sm text-gray-400">
                              {game.genres?.map(genre => genre.name).join(', ')}
                            </span>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => handleWishlistClick(e, game)}
                            className={`p-2 rounded-full ${
                              game.isWishlisted 
                                ? 'bg-[#b91c1c] text-white' 
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                          >
                            <FaHeart />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {!loading && games.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(prev => prev + 1)}
              className="bg-gradient-to-r from-[#b91c1c] to-[#ef4444] hover:from-[#991b1b] hover:to-[#b91c1c] px-8 py-4 rounded-xl font-medium transition-all duration-300 text-white shadow-lg"
            >
              Load More Games
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 