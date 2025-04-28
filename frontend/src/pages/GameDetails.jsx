import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FaStar, FaWindows, FaPlaystation, FaXbox, FaShoppingCart, FaHeart, FaPlay, FaSteam } from 'react-icons/fa';
import { getGameDetails, getGameScreenshots, getGameTrailers } from '../services/rawgApi';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';

const GameDetails = () => {
  const { id } = useParams();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [steamAppId, setSteamAppId] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        setLoading(true);
        const [gameData, screenshotsData, trailersData] = await Promise.all([
          getGameDetails(id),
          getGameScreenshots(id),
          getGameTrailers(id)
        ]);
        setGame(gameData);
        setScreenshots(screenshotsData.results);
        setTrailers(trailersData.results);
        setIsWishlisted(isInWishlist(parseInt(id)));

        // Debug log
        console.log('Game data:', gameData);
        console.log('Game stores:', gameData.stores);

        // Extract Steam App ID from store URL if available
        if (gameData.stores && gameData.stores.length > 0) {
          const steamStore = gameData.stores.find(store => 
            store.store?.name?.toLowerCase() === 'steam' ||
            store.url?.toLowerCase().includes('steampowered.com')
          );
          
          console.log('Steam store found:', steamStore); // Debug log

          if (steamStore?.url) {
            const steamUrl = steamStore.url;
            console.log('Steam URL:', steamUrl); // Debug log
            const steamIdMatch = steamUrl.match(/\/app\/(\d+)/);
            if (steamIdMatch) {
              const steamId = steamIdMatch[1];
              console.log('Steam ID found:', steamId); // Debug log
              setSteamAppId(steamId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [id]);

  // Debug log for steamAppId state
  useEffect(() => {
    console.log('Current Steam App ID:', steamAppId);
  }, [steamAppId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWishlistClick = () => {
    if (isWishlisted) {
      removeFromWishlist(game.id);
    } else {
      addToWishlist(game);
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleBuyOnSteam = (e) => {
    e.preventDefault();
    if (steamAppId) {
      window.open(`https://store.steampowered.com/app/${steamAppId}`, '_blank');
    }
  };

  if (loading || !game) {
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh]"
      >
        <div className="absolute inset-0">
          <img 
            src={game.background_image}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-end gap-6"
            >
              <img 
                src={screenshots[0]?.image || game.background_image}
                alt={game.name}
                className="w-48 h-64 object-cover rounded-lg shadow-2xl"
              />
              <div className="flex-1">
                <h1 className="text-6xl font-bold mb-4">{game.name}</h1>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                    <FaStar className="text-yellow-500" />
                    <span className="text-xl font-bold">{game.rating}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleWishlistClick}
                    className={`${
                      isWishlisted ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'
                    } px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200`}
                  >
                    {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    <FaHeart className={isWishlisted ? "text-white" : "text-gray-400"} />
                  </motion.button>
                  {steamAppId && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBuyOnSteam}
                      className="bg-[#171a21] hover:bg-[#1b2838] px-6 py-2 rounded-full flex items-center gap-2 text-white"
                    >
                      <FaSteam className="text-white" />
                      <span>Buy on Steam</span>
                    </motion.button>
                  )}
                  {trailers.length > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full flex items-center gap-2"
                      onClick={() => window.open(trailers[0].data.max, '_blank')}
                    >
                      Watch Trailer
                      <FaPlay />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <div 
                className="text-gray-300 mb-8 space-y-4"
                dangerouslySetInnerHTML={{ __html: game.description }}
              />

              {screenshots.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {screenshots.slice(0, 4).map((screenshot, index) => (
                      <motion.img
                        key={screenshot.id}
                        src={screenshot.image}
                        alt={`Screenshot ${index + 1}`}
                        className="rounded-lg w-full h-48 object-cover cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => window.open(screenshot.image, '_blank')}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Game Info</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-gray-400 text-sm">Platforms</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.platforms.map(({ platform }) => (
                      <span key={platform.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                        {platform.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.genres.map(genre => (
                      <span key={genre.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Release Date</h3>
                  <p>{new Date(game.released).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Developer</h3>
                  <p>{game.developers?.map(dev => dev.name).join(', ')}</p>
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Publisher</h3>
                  <p>{game.publishers?.map(pub => pub.name).join(', ')}</p>
                </div>
                {steamAppId && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Steam Store</h3>
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      href={`https://store.steampowered.com/app/${steamAppId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mt-1"
                    >
                      <FaSteam />
                      View on Steam
                    </motion.a>
                  </div>
                )}
                {game.website && (
                  <div>
                    <h3 className="text-gray-400 text-sm">Website</h3>
                    <a
                      href={game.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Visit Official Website
                    </a>
                  </div>
                )}
              </div>

              {game.ratings_count > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Rating Breakdown</h2>
                  <div className="space-y-2">
                    {game.ratings.map(rating => (
                      <div key={rating.id} className="flex items-center gap-2">
                        <span className="w-20">{rating.title}</span>
                        <div className="flex-1 bg-gray-800 h-4 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${rating.percent}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="h-full bg-yellow-500"
                          />
                        </div>
                        <span className="w-12 text-right">{Math.round(rating.percent)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
