import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchDeals } from '../services/cheapSharkApi';
import { motion } from 'framer-motion';

const GameCard = ({ game }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const exchangeRate = 83.5; // USD to INR rate

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const deals = await searchDeals(game.title);
        if (deals && deals.length > 0) {
          // Find the best deal (lowest price)
          const bestDeal = deals.reduce((min, deal) => 
            parseFloat(deal.salePrice) < parseFloat(min.salePrice) ? deal : min
          );
          setPrice({
            salePrice: bestDeal.salePrice,
            normalPrice: bestDeal.normalPrice,
            isOnSale: bestDeal.salePrice !== bestDeal.normalPrice
          });
        }
        setError(null);
      } catch (err) {
        setError('Failed to fetch price');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
  }, [game.title]);

  const convertToINR = (usdPrice) => {
    return (usdPrice * exchangeRate).toFixed(2);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 p-4 rounded-lg shadow-md"
    >
      <img src={game.image} alt={game.title} className="w-full h-40 object-cover rounded" />
      <h2 className="text-xl font-bold mt-2 text-white">{game.title}</h2>
      <p className="text-sm text-gray-300">{game.genre}</p>
      
      {loading ? (
        <div className="flex justify-center items-center py-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500 py-2">Price unavailable</p>
      ) : price ? (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-green-400 font-bold">₹{convertToINR(price.salePrice)}</span>
            {price.isOnSale && (
              <span className="text-sm text-gray-400 line-through">₹{convertToINR(price.normalPrice)}</span>
            )}
          </div>
    </div>
      ) : (
        <p className="text-sm text-gray-400 py-2">No deals available</p>
      )}

      <Link 
        to={`/games/${game._id}`} 
        className="text-blue-400 hover:underline block mt-2"
      >
        View Details
      </Link>
    </motion.div>
  );
};

export default GameCard;
