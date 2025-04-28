import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaSearch, FaHeart } from 'react-icons/fa';
import { getGames, searchGames } from '../services/rawgApi';
import { isInWishlist, addToWishlist, removeFromWishlist } from '../services/wishlistService';

const SearchPage = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedPlatform, setPlatform] = useState('All Platforms');
  const [selectedRating, setRating] = useState('All Ratings');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchGames();
  }, [page]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getGames(page);
      // Add wishlist status to each game
      const gamesWithWishlist = data.results.map(game => ({
        ...game,
        isWishlisted: isInWishlist(game.id)
      }));
      setGames(gamesWithWishlist);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchGames();
      return;
    }
    try {
      setLoading(true);
      const data = await searchGames(searchQuery);
      // Add wishlist status to search results
      const gamesWithWishlist = data.results.map(game => ({
        ...game,
        isWishlisted: isInWishlist(game.id)
      }));
      setGames(gamesWithWishlist);
    } catch (error) {
      console.error('Error searching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistClick = (e, game) => {
    e.stopPropagation(); // Prevent navigation when clicking wishlist button
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search games..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <FaSearch />
              Search
            </motion.button>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 sticky top-20 z-10 bg-black py-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full ${
              selectedGenre === 'All Genres' ? 'bg-gray-700' : 'bg-gray-800'
            } hover:bg-gray-600`}
            onClick={() => setSelectedGenre('All Genres')}
          >
            All Genres
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full ${
              selectedPlatform === 'All Platforms' ? 'bg-gray-700' : 'bg-gray-800'
            } hover:bg-gray-600`}
            onClick={() => setPlatform('All Platforms')}
          >
            All Platforms
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full ${
              selectedRating === 'All Ratings' ? 'bg-gray-700' : 'bg-gray-800'
            } hover:bg-gray-600`}
            onClick={() => setRating('All Ratings')}
          >
            All Ratings
          </motion.button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        )}

        {/* Game Grid */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {games.map((game) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative group cursor-pointer"
                onClick={() => navigate(`/game/${game.id}`)}
              >
                <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-900">
                  <img
                    src={game.background_image}
                    alt={game.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold text-white">{game.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-gray-200">{game.rating}</span>
                          <span className="ml-2 text-sm text-gray-400">
                            {game.genres?.map(genre => genre.name).join(', ')}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => handleWishlistClick(e, game)}
                          className={`p-2 rounded-full ${
                            game.isWishlisted ? 'bg-red-600' : 'bg-gray-800'
                          }`}
                        >
                          <FaHeart className={game.isWishlisted ? "text-white" : "text-gray-400"} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!loading && games.length > 0 && (
          <div className="mt-8 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(prev => prev + 1)}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg"
            >
              Load More Games
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 