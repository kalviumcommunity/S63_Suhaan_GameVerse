import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FaStar, FaHeart, FaPlay, FaSteam } from 'react-icons/fa';
import { getGameDetails, getGameScreenshots, getGameTrailers } from '../services/rawgApi';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlistService';
import ReviewSection from '../components/ReviewSection';
import GamePrice from '../components/GamePrice';

const fadeIn = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] } },
};
const buttonVariants = {
  whileHover: { scale: 1.05, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
  whileTap: { scale: 0.98 },
};

const GameDetails = () => {
  const { id } = useParams();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [steamAppId, setSteamAppId] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user')) || null;
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const heroControls = useAnimation();

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
        if (gameData.stores && gameData.stores.length > 0) {
          const steamStore = gameData.stores.find(store => 
            store.store?.name?.toLowerCase() === 'steam' ||
            store.url?.toLowerCase().includes('steampowered.com')
          );
          if (steamStore?.url) {
            const steamUrl = steamStore.url;
            const steamIdMatch = steamUrl.match(/\/app\/(\d+)/);
            if (steamIdMatch) setSteamAppId(steamIdMatch[1]);
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

  useEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
      });
    }, 50);
  }, [id]);

  // Cinematic hero parallax/zoom effect
  useEffect(() => {
    heroControls.start({ scale: 1.08, opacity: 1 });
    setTimeout(() => {
      heroControls.start({ scale: 1, opacity: 1, transition: { duration: 2, ease: [0.6, -0.05, 0.01, 0.99] } });
    }, 400);
  }, [game, heroControls]);

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Animated rating bars
  const total = game.ratings.reduce((sum, r) => sum + r.count, 0);
  const colors = ["#38bdf8", "#6366f1", "#facc15", "#f472b6", "#a3e635"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-black via-[#1a1a1a] to-[#181818] text-white font-['Space_Grotesk']"
    >
      {/* Cinematic Hero Banner */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <motion.img
          src={game.background_image}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover z-0"
          initial={{ scale: 1.12, opacity: 0 }}
          animate={heroControls}
          transition={{ duration: 1.8, ease: [0.6, -0.05, 0.01, 0.99] }}
        />
        {/* Vignette and dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#1a1a1a]/70 to-transparent z-10" />
        <div className="absolute inset-0 pointer-events-none z-20" style={{boxShadow:'inset 0 0 150px 30px #000'}} />
        <motion.div
          className="relative z-30 flex flex-col items-center justify-center w-full h-full"
          initial="initial"
          animate="animate"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold font-['Orbitron'] text-center mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {game.name}
          </motion.h1>
          <motion.div className="flex flex-wrap items-center justify-center gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }}>
            <span className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full text-xl font-bold text-white shadow-md">
              <FaStar className="text-[#dc2626]" />
              {game.rating}
            </span>
            <span className="text-base text-white/90 font-['Inter']">{game.genres.map(g => g.name).join(', ')}</span>
            <span className="text-base text-white/70 font-['Inter']">{game.released && new Date(game.released).toLocaleDateString()}</span>
          </motion.div>
          <motion.div className="flex flex-wrap gap-6 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.7 }}>
            <motion.button
              variants={buttonVariants}
              whileHover="whileHover"
              whileTap="whileTap"
              onClick={handleWishlistClick}
              className={`px-8 py-4 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 shadow-lg text-lg ${isWishlisted ? 'bg-[#991b1b] hover:bg-[#7f1d1d]' : 'bg-white/10 hover:bg-white/20'} ring-1 ring-white/10 focus:ring-2 focus:ring-white/20`}
              style={{boxShadow:'0 0 8px 1px rgba(0,0,0,0.2)'}}
            >
              <FaHeart className="text-white" />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </motion.button>
            {steamAppId && (
              <motion.button
                variants={buttonVariants}
                whileHover="whileHover"
                whileTap="whileTap"
                onClick={handleBuyOnSteam}
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-lg flex items-center gap-2 text-white font-semibold shadow-lg text-lg ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
                style={{boxShadow:'0 0 8px 1px rgba(0,0,0,0.2)'}}
              >
                <FaSteam /> Buy on Steam
              </motion.button>
            )}
            {trailers.length > 0 && (
              <motion.button
                variants={buttonVariants}
                whileHover="whileHover"
                whileTap="whileTap"
                className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-lg flex items-center gap-2 text-white font-semibold shadow-lg text-lg ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
                style={{boxShadow:'0 0 8px 1px rgba(0,0,0,0.2)'}}
                onClick={() => window.open(trailers[0].data.max, '_blank')}
              >
                <FaPlay /> Watch Trailer
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* Floating Info Card */}
      <motion.section
        className="relative z-30 max-w-5xl mx-auto -mt-24 mb-16"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="bg-[#181818]/80 backdrop-blur-xl rounded-xl shadow-lg p-8 flex flex-col md:flex-row gap-8 border border-white/10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4 font-['Orbitron'] text-white">About</h2>
            <div className="text-white/70 mb-4 text-lg font-['Inter']" dangerouslySetInnerHTML={{ __html: game.description }} />
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <span className="block text-xs text-white/50">Release</span>
                <span className="font-['Orbitron'] text-base text-white/70">{new Date(game.released).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="block text-xs text-white/50">Platforms</span>
                <span className="font-['Inter'] text-base text-white/70">{game.platforms.map(({ platform }) => platform.name).join(', ')}</span>
              </div>
              <div>
                <span className="block text-xs text-white/50">Developer</span>
                <span className="font-['Inter'] text-base text-white/70">{game.developers?.map(dev => dev.name).join(', ')}</span>
              </div>
              <div>
                <span className="block text-xs text-white/50">Publisher</span>
                <span className="font-['Inter'] text-base text-white/70">{game.publishers?.map(pub => pub.name).join(', ')}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 min-w-[220px]">
            <GamePrice gameTitle={game.name} gameId={game.id} />
            {steamAppId && (
              <motion.a
                whileHover={{ scale: 1.02 }}
                href={`https://store.steampowered.com/app/${steamAppId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/70 hover:text-white mt-1 font-['Inter'] text-base"
              >
                <FaSteam />
                View on Steam
              </motion.a>
            )}
            {game.website && (
              <a
                href={game.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white font-['Inter'] text-base"
              >
                Visit Official Website
              </a>
            )}
          </div>
        </div>
      </motion.section>

      {/* Screenshots Gallery */}
      {screenshots.length > 0 && (
        <motion.section className="max-w-6xl mx-auto mb-16" initial="initial" animate="animate">
          <h2 className="text-2xl font-bold mb-6 font-['Orbitron'] text-white">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {screenshots.slice(0, 9).map((screenshot, index) => (
              <motion.div
                key={screenshot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                onClick={() => { setShowModal(true); setModalImg(screenshot.image); }}
              >
                <motion.img
                  src={screenshot.image}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-white text-lg font-semibold">Click to view</div>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Modal for screenshot preview */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              >
                <motion.img
                  src={modalImg}
                  alt="Screenshot Preview"
                  className="max-w-3xl max-h-[80vh] rounded-xl shadow-2xl border border-white/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={e => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      )}

      {/* Animated Ratings */}
      {game.ratings_count > 0 && (
        <motion.section className="max-w-4xl mx-auto mb-16" initial="initial" animate="animate">
          <h2 className="text-2xl font-bold mb-6 font-['Orbitron'] text-white">Rating Breakdown</h2>
          <div className="space-y-6">
            {game.ratings.map((rating, i) => (
              <div key={rating.id} className="flex items-center gap-4">
                <span className="w-32 text-left font-['Space_Grotesk'] text-base text-white/70">{rating.title}</span>
                <div className="flex-1 h-6 rounded-full bg-[#181818] overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(rating.count / total) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                    className="h-6 rounded-full shadow-md"
                    style={{ background: `linear-gradient(90deg, #dc2626, #991b1b 80%)` }}
                  />
                </div>
                <span className="w-12 text-right font-['Orbitron'] text-lg text-white/70">{Math.round((rating.count / total) * 100)}%</span>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Reviews Section */}
      <motion.section className="max-w-4xl mx-auto mb-24" initial="initial" animate="animate">
        <ReviewSection gameId={game.id || game._id} currentUser={currentUser} />
      </motion.section>
    </motion.div>
  );
};

export default GameDetails;
